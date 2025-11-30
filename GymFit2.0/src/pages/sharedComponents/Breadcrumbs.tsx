// Componente de breadcrumbs para navegacion mejorada
// Functional Component: Componente de React definido como funcion
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
// Importación de constantes de colores
import { COLORS } from '../../constants';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para navegar a las rutas cuando el usuario hace clic en un breadcrumb
  const navigate = useNavigate();
  
  // useLocation: Hook que retorna la ubicación actual de la ruta
  // Se utiliza para generar los breadcrumbs automáticamente basados en la URL actual
  const location = useLocation();

  // Breadcrumbs por defecto basados en la ruta actual
  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Inicio', path: '/' }];

    if (segments.length === 0) return breadcrumbs;

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      let label = segment;
      
      // Mapeo de rutas a etiquetas amigables
      const routeLabels: Record<string, string> = {
        'store': 'Tienda',
        'cart': 'Carrito',
        'product': 'Detalle del Producto',
        'login': 'Iniciar Sesion',
        'register': 'Registrarse',
        'user-panel': 'Mi Panel',
        'admin': 'Panel de Administracion'
      };

      if (routeLabels[segment]) {
        label = routeLabels[segment];
      } else if (segment.match(/^[a-f0-9-]+$/i)) {
        // Es un ID, no mostrar en el breadcrumb
        return;
      } else {
        // Capitalizar primera letra
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || getDefaultBreadcrumbs();

  return (
    <Breadcrumb className="mb-3">
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          active={!item.path}
          onClick={() => item.path && navigate(item.path)}
          style={{
            cursor: item.path ? 'pointer' : 'default'
          }}
        >
          {item.path ? (
            <span style={{ color: COLORS.COLOR_3 }}>{item.label}</span>
          ) : (
            item.label
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

