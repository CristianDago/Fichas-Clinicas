// src/components/layouts/protected-layout/protected.layout.tsx

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar"; // <-- Importa el nuevo Navbar
import layoutCss from "../../../assets/styles/layout/protected.layout.module.scss"; // Tu CSS para el layout


const ProtectedLayout: React.FC = () => {
  return (
    <div className={layoutCss.protectedLayout}>
      <Navbar /> {/* Renderiza la Navbar en la parte superior */}
      <main className={layoutCss.mainContent}> {/* El contenido de la página se renderiza aquí */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;