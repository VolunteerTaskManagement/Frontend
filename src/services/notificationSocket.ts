import * as signalR from '@microsoft/signalr';
import { authStorage } from './authStorage';

// این یک اتصال singleton در سطح ماژول است تا با mount/unmount شدن کامپوننت‌ها
// (مثلاً هدر که ممکنه در هر صفحه دوباره mount بشه) یک اتصال جدید ساخته نشه
// و کانکشن زنده در طول عمر برنامه فقط یک بار برقرار بشه.

type NotificationListener = (payload: unknown) => void;

const NOTIFICATION_HUB_URL = 'ws://89.42.199.196:5213/NotifRoot';

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;
const listeners = new Set<NotificationListener>();

function buildConnection(): signalR.HubConnection {
  const token = authStorage.getAccessToken() ?? '';

  return new signalR.HubConnectionBuilder()
    .withUrl(`${NOTIFICATION_HUB_URL}?access_token=${encodeURIComponent(token)}`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();
}

export function connectNotificationSocket(): Promise<void> {
  if (!connection) {
    connection = buildConnection();
    connection.on('ReceiveNotification', (payload: unknown) => {
      listeners.forEach((listener) => listener(payload));
    });
  }

  if (connection.state === signalR.HubConnectionState.Connected) {
    return Promise.resolve();
  }

  if (!startPromise) {
    startPromise = connection.start().catch((err) => {
      startPromise = null;
      throw err;
    });
  }

  return startPromise;
}

// یک شنونده برای پیام‌های دریافتی ثبت می‌کند و تابعی برای لغو ثبت برمی‌گرداند.
// چندین کامپوننت می‌توانند هم‌زمان شنونده ثبت کنند بدون این‌که اتصال تکراری ساخته شود.
export function onReceiveNotification(listener: NotificationListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// در حال حاضر جایی صدا زده نمی‌شود (اتصال باید در طول عمر برنامه زنده بماند)،
// ولی برای مثلاً هنگام خروج از حساب کاربری در دسترس است.
export function disconnectNotificationSocket() {
  if (connection) {
    connection.stop();
    connection = null;
    startPromise = null;
  }
}