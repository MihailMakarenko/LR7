import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddPublication from "./Client/pages/addMagazine/addMagazine";
import UserPage from "./Client/pages/userPage/userPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/addPublication" element={<AddPublication />} />
          {/* Используйте угловые скобки */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
