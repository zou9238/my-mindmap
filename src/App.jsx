import { useEffect, useRef } from "react";
import MindElixir from "mind-elixir";
import "./assets/css/MindElixir.css";

function App() {
  const containerRef = useRef(null);
  const mindRef = useRef(null);

  useEffect(() => {
    // 1. 初始化 MindElixir 實體
    const mind = new MindElixir({
      el: containerRef.current,
      direction: MindElixir.SIDE,
      draggable: true,
      editable: true,
      contextMenu: true,
      toolBar: true,
      keypress: true,
    });

    // 2. 讀取存檔
    const savedData = localStorage.getItem("mindmap_final_exam");
    const initialData = savedData ? JSON.parse(savedData) : {
      nodeData: { 
        id: "root", 
        topic: "資工所 📚", 
        children: [
          { id: "n1", topic: "經濟學" },
          { id: "n2", topic: "統計學" }
        ] 
      }
    };

    mind.init(initialData);
    mindRef.current = mind;

    // 3. 設定自動儲存
    mind.bus.addListener("operation", () => {
      if (mindRef.current) {
        const data = mindRef.current.getData();
        localStorage.setItem("mindmap_final_exam", JSON.stringify(data));
      }
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif" }}>
      {/* 強制移除瀏覽器預設的 margin/padding */}
      <style>
        {`
          body { margin: 0; padding: 0; overflow: hidden; }
          #root { width: 100%; height: 100%; }
        `}
      </style>

      {/* 1. 標題列：設定 flex-shrink 為 0 確保它不被壓縮 */}
      <header style={{ 
        padding: "15px 25px", 
        background: "#7480b1", 
        color: "white", 
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        flexShrink: 0 
      }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "1px" }}>
          心智圖 🎓
        </div>
      </header>

      {/* 2. 心智圖畫布區域：flex: 1 會自動佔滿剩餘高度 */}
      <div 
        ref={containerRef} 
        style={{ 
          flex: 1, 
          width: "100%", 
          background: "#fdfdfd" 
        }} 
      />
      
      {/* 3. 底部狀態列 */}
      <footer style={{ 
        padding: "8px 20px", 
        background: "#ecf0f1", 
        fontSize: "13px", 
        color: "#7f8c8d", 
        display: "flex", 
        justifyContent: "space-between",
        flexShrink: 0
      }}>
        <span>💡 快速操作：<b>Enter</b> 新增同層節點 | <b>Tab</b> 新增子節點</span>
        <span>狀態：自動儲存已啟動</span>
      </footer>
    </div>
  );
}

export default App;