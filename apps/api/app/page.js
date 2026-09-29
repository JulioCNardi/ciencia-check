export default function HomePage() {
  return (
    <main>
      <h1>Ciencia Check API</h1>
      <p>API do protótipo APEX — use as rotas em /api/*</p>
      <ul>
        <li>POST /api/auth</li>
        <li>GET /api/missions</li>
        <li>GET /api/challenges</li>
        <li>POST /api/challenges/submit</li>
        <li>GET /api/leaderboard?classCode=DEMO2026</li>
        <li>GET /api/student/me?studentId=...</li>
        <li>GET /api/learn</li>
      </ul>
    </main>
  );
}
