import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome to Tasks.org Desktop</h1>
        <p className="text-muted-foreground">
          Your tasks will appear here soon.
        </p>
      </div>
    </Layout>
  );
}

export default App;
