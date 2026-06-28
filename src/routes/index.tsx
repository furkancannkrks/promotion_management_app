import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/Layout";
import { ProductDetailPage } from "../pages/ProductDetail";
import { ProductsPage } from "../pages/Products";
import { PromotionsPage } from "../pages/Promotions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "promotions",
        element: <PromotionsPage />,
      },
    ],
  },
]);
