import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <p className="serif" style={{ fontSize: 28, marginBottom: 12 }}>페이지를 찾을 수 없습니다</p>
      <Link className="rail-more mono" href="/">← 메인으로 돌아가기</Link>
    </div>
  );
}
