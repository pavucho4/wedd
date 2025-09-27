import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Test from "./pages/Test";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Index />} />
    </Routes>
  </BrowserRouter>
);

export default App;
