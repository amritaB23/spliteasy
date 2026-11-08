import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import GroupsPage from './pages/GroupsPage';
import GroupPage from './pages/GroupPage';

// Two pages: the list of groups, and one group's details.
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
