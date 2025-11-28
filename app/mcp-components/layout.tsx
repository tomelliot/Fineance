import "./widgets.css";
import { ChatGPTSDKBootstrap } from "./chatgpt-sdk-bootstrap";

export default function MCPComponentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ChatGPTSDKBootstrap />
      {children}
    </>
  );
}
