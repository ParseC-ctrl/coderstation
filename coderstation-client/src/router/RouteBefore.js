import { useLocation } from "react-router-dom";
import RouteConfig from "./index.jsx";
import RouteBeforeConfig from "./RouteBeforeConfig";
import { Alert } from "antd";

function RouteBefore() {

  useLocation()

  // 导航守卫
  const currentPath = RouteBeforeConfig.filter(
    (item) => item.path === location.pathname
  )[0];
  // console.log(currentPath)
  
  function closeHandle() {
    location.pathname = "/issues";
  }
  // console.log(myLocation)

  if (currentPath) {
    if (currentPath.needLogin && !localStorage.getItem("userToken")) {
      return (
        <Alert
          message="请先登录"
          type="warning"
          closable
          onClose={closeHandle}
        />
      );
    }
  }

  return <RouteConfig />;
}

export default RouteBefore;
