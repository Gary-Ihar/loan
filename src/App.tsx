import './App.css';
import { Layout, Typography } from 'antd';
import { LoanForm } from './Form';

const App = () => {
  return (
    <Layout>
      <Layout.Header>
        <Typography.Text style={{ color: 'white' }}>Кредит калькулятор</Typography.Text>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: 48,
        }}
      >
        <LoanForm />
      </Layout.Content>
    </Layout>
  );
};

export default App;
