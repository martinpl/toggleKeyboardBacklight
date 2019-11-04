const Gio = imports.gi.Gio;

var toggleKeyboardBacklightClass = new imports.lang.Class({
	Name: 'Toggle Keyboard Backlight',
	Extends: imports.ui.panelMenu.Button,

    _init() {
        this.parent(0.0, "Toggle Keyboard Backlight");
        this.add_child( new imports.gi.St.Icon({ gicon: new Gio.ThemedIcon({ name: 'accessories-text-editor-symbolic' }), style_class: 'system-status-icon' }) );
        this.connect('button-press-event', this._onButtonPress.bind());
    },

    _onButtonPress() {
        const KbdBacklightInterface = '<node>\
        <interface name="org.freedesktop.UPower.KbdBacklight"> \
            <method name="SetBrightness"><arg name="value" type="i" direction="in"/></method> \
            <method name="GetBrightness"><arg name="value" type="i" direction="out"/></method> \
        </interface></node>';

        const KbdBacklightProxy = Gio.DBusProxy.makeProxyWrapper(KbdBacklightInterface);
        let KbdBacklight = new KbdBacklightProxy( Gio.DBus.system, "org.freedesktop.UPower", "/org/freedesktop/UPower/KbdBacklight" );

        if( KbdBacklight.GetBrightnessSync() == 0 ) {
            KbdBacklight.SetBrightnessSync(1);
        } else {
            KbdBacklight.SetBrightnessSync(0);
        }
    }
});

let toggleKeyboardBacklight;

class Extension {
    enable() {
        toggleKeyboardBacklight = new toggleKeyboardBacklightClass();
        imports.ui.main.panel.addToStatusArea(`Toggle Keyboard Backlight`, toggleKeyboardBacklight);
    }

    disable() { toggleKeyboardBacklight.destroy(); }
}

function init() {
    return new Extension();
}
