package com.gymbody.ai;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            this.bridge.getWebView().getSettings().setForceDark(android.webkit.WebSettings.FORCE_DARK_OFF);
        }
    }
}
