import { NextResponse } from 'next/server';
import { getByField, updateById, insertWithAutoId } from '@/lib/firestore-helpers';
import { COLLECTIONS } from '@/lib/collections';
import { Timestamp } from 'firebase/firestore';

/**
 * Helper to get or create the ESP32 state in Firestore.
 * We store this in the monitoring_components table with component_key = 'esp32_state'.
 */
async function getOrCreateEspState() {
  let stateDoc = await getByField(COLLECTIONS.MONITORING_COMPONENTS, 'component_key', 'esp32_state');
  
  if (!stateDoc) {
    const initialState = {
      command: 'IDLE',
      ssid: '',
      password: '',
      scan_results: [],
      status: 'offline',
      current_ssid: 'Unknown',
      last_seen: 0,
      esp_ip: 'Unknown',
      change_status: 'idle',
      rssi: -90,
      bt_status: 'off',
      tft_force_screen: 'none',
    };

    const result = await insertWithAutoId(COLLECTIONS.MONITORING_COMPONENTS, 'id', {
      component_key: 'esp32_state',
      component_name: 'ESP32 Internal State',
      component_type: 'system',
      status: 'online',
      extra_data: initialState,
    });
    
    stateDoc = { _docId: result.docId, extra_data: initialState };
  }

  return stateDoc;
}

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

async function handleRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Action can come from URL or formData
  let action = searchParams.get('action');
  let formData: FormData | null = null;
  
  if (request.method === 'POST') {
    try {
      formData = await request.formData();
      if (!action) action = formData.get('action') as string;
    } catch {
      // Body might be JSON
      try {
        const body = await request.json();
        if (!action) action = body.action;
      } catch {}
    }
  }

  try {
    const stateDoc = await getOrCreateEspState();
    let state = stateDoc.extra_data || {};

    const updateState = async (newState: Record<string, any>) => {
      state = { ...state, ...newState };
      await updateById(COLLECTIONS.MONITORING_COMPONENTS, stateDoc._docId, {
        extra_data: state,
        last_seen: Timestamp.now(),
      });
    };

    // ==========================================
    // DASHBOARD ENDPOINTS
    // ==========================================
    if (action === 'trigger_scan') {
      await updateState({ command: 'SCAN', scan_results: [] });
      return NextResponse.json({ success: true, message: 'Scan triggered' });
    }

    if (action === 'trigger_bt_on') {
      await updateState({ command: 'BT_ON', bt_status: 'pending' });
      return NextResponse.json({ success: true, message: 'Bluetooth ON command queued' });
    }

    if (action === 'trigger_bt_off') {
      await updateState({ command: 'BT_OFF', bt_status: 'off' });
      return NextResponse.json({ success: true, message: 'Bluetooth OFF command queued' });
    }

    if (action === 'get_bt_status') {
      return NextResponse.json({ success: true, bt_status: state.bt_status || 'off' });
    }

    if (action === 'get_scan_results') {
      if (state.command === 'SCAN_COMPLETE') {
        const results = state.scan_results || [];
        await updateState({ command: 'IDLE' });
        return NextResponse.json({ success: true, results });
      } else {
        return NextResponse.json({ success: false, message: 'Scanning in progress' });
      }
    }

    if (action === 'change_wifi') {
      const ssid = formData?.get('ssid') as string || '';
      const password = formData?.get('password') as string || '';
      
      if (!ssid) return NextResponse.json({ success: false, message: 'SSID cannot be empty' });
      
      await updateState({ command: 'CHANGE_WIFI', ssid, password, change_status: 'pending' });
      return NextResponse.json({ success: true, message: 'WiFi change command queued' });
    }

    if (action === 'get_change_status') {
      const currentStatus = state.change_status || 'idle';
      if (currentStatus === 'success' || currentStatus === 'failed') {
        await updateState({ change_status: 'idle' });
      }
      return NextResponse.json({ success: true, status: currentStatus });
    }

    if (action === 'set_tft_screen') {
      const screen = formData?.get('screen') as string || searchParams.get('screen') || 'none';
      await updateState({ tft_force_screen: screen });
      return NextResponse.json({ success: true, message: 'TFT screen command queued' });
    }

    // ==========================================
    // ESP32 ENDPOINTS
    // ==========================================
    if (action === 'get_command') {
      const currentCommand = state.command || 'IDLE';
      const response = {
        command: currentCommand,
        ssid: state.ssid || '',
        password: state.password || '',
        tft_force_screen: state.tft_force_screen || 'none'
      };

      // Reset specific commands after they are read by ESP32
      if (['CHANGE_WIFI', 'BT_ON', 'BT_OFF'].includes(currentCommand)) {
        await updateState({ command: 'IDLE' });
      }

      return NextResponse.json(response);
    }

    if (action === 'post_scan_results') {
      const rawData = await request.text();
      let networks = [];
      try {
        const parsed = JSON.parse(rawData);
        networks = parsed.networks || [];
      } catch (e) {
        return NextResponse.json({ success: false, message: 'Invalid JSON' });
      }
      
      await updateState({ command: 'SCAN_COMPLETE', scan_results: networks });
      return NextResponse.json({ success: true });
    }

    if (action === 'update_status') {
      const esp_ip = formData?.get('ip') as string || searchParams.get('ip') || 'Unknown';
      const current_ssid = formData?.get('ssid') as string || searchParams.get('ssid') || 'Unknown';
      const rssiStr = formData?.get('rssi') as string || searchParams.get('rssi') || '-90';
      
      await updateState({
        status: 'online',
        last_seen: Date.now(),
        esp_ip,
        current_ssid,
        rssi: parseInt(rssiStr, 10)
      });
      
      return NextResponse.json({ success: true });
    }

    if (action === 'report_wifi_change') {
      const result = formData?.get('result') as string || searchParams.get('result') || 'failed';
      await updateState({ change_status: result });
      return NextResponse.json({ success: true });
    }

    if (action === 'report_bt_status') {
      const bt_status = formData?.get('status') as string || searchParams.get('status') || 'off';
      await updateState({ bt_status });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
