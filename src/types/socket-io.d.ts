declare namespace SocketIOClient {
    interface Socket {
        on(event: 'reconnect_failed', listener: () => void): this;

        on(event: 'reconnect_attempt', listener: (times: number) => void): this;

        on(event: 'disconnect', listener: () => void): this;
    }
}
