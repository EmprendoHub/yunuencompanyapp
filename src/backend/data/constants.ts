export const SIDENAV_ITEMS = [
  {
    title: "Inicio",
    path: "/admin",
  },
  {
    title: "Pedidos",
    path: "/admin/pedidos",
  },
  {
    title: "Publicaciones",
    path: "/admin/blog",
    submenu: true,
    subMenuItems: [
      { title: "Todas", path: "/admin/blog" },
      { title: "Nueva", path: "/admin/blog/editor" },
    ],
  },
  {
    title: "Productos",
    path: "/admin/productos",
    submenu: true,
    subMenuItems: [
      { title: "Todos", path: "/admin/productos" },
      { title: "Nuevo", path: "/admin/productos/nuevo" },
    ],
  },
  {
    title: "Usuarios",
    path: "/admin/clientes",
    submenu: true,
    subMenuItems: [
      { title: "Clientes", path: "/admin/clientes" },
      { title: "Afiliados", path: "/admin/asociados" },
    ],
  },
];

export const POSNAV_ITEMS = [
  {
    title: "Inicio",
    path: "/puntodeventa",
  },
  {
    title: "Pedidos",
    path: "/puntodeventa/pedidos",
  },
  {
    title: "Productos",
    path: "/puntodeventa/productos",
  },
  {
    title: "Scanner",
    path: "/puntodeventa/qr/scanner",
  },
  {
    title: "Etiquetas QR",
    path: "/puntodeventa/qr/generador",
  },
];
