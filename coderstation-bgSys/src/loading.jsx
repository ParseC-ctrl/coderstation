import { Spin } from 'antd';

function loading() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="large"/>
    </div>
  );
}

export default loading;
