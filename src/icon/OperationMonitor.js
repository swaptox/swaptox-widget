/**
 * 页面活跃状态监控器
 */
export class OperationMonitor extends EventTarget {
    constructor(idleTimeoutMs = 5 * 60 * 1000) {
        super();
        this.isOperational = true;
        this.idleTimeout = idleTimeoutMs;
        this._idleTimer = null;
        this._running = false;
    }

    _handleVisibility = () => {
        if (document.hidden) {
            this._updateStatus(false, "hidden");
        } else {
            this._resetIdleTimer();
            this._updateStatus(true, "visible");
        }
    }

    _handleActivity = () => {
        if (document.hidden) return;

        if (!this.isOperational) {
            this._updateStatus(true, "activity");
        }
        this._resetIdleTimer();
    }

    start() {
        if (this._running) return;
        this._running = true;

        document.addEventListener("visibilitychange", this._handleVisibility);

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(evt => {
            window.addEventListener(evt, this._handleActivity, { passive: true });
        });

        this._resetIdleTimer();
        //console.log("[OperationMonitor] Started");
    }

    stop() {
        if (!this._running) return;
        this._running = false;

        clearTimeout(this._idleTimer);
        document.removeEventListener("visibilitychange", this._handleVisibility);
        
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(evt => {
            window.removeEventListener(evt, this._handleActivity);
        });
        //console.log("[OperationMonitor] Stopped");
    }

    _resetIdleTimer() {
        clearTimeout(this._idleTimer);
        if (!this._running) return;

        this._idleTimer = setTimeout(() => {
            this._updateStatus(false, "idle");
        }, this.idleTimeout);
    }

    _updateStatus(newStatus, reason) {
        if (this.isOperational === newStatus) return;
        this.isOperational = newStatus;
        
        this.dispatchEvent(new CustomEvent('status-change', {
            detail: { isOperational: newStatus, reason }
        }));
    }
}