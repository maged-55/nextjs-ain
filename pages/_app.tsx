import type { AppProps } from "next/app";
import "../styles/antd-theme.less";
import { ConfigProvider } from "antd";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider direction="rtl">
    <Component {...pageProps} />
    </ConfigProvider>);
}

export default MyApp;
