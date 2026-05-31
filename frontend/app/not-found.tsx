import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <p className="display" style={{ fontSize: "1.8rem", marginBottom: 16 }}>페이지를 찾을 수 없습니다</p>
      <Link className="btn btn-primary" href="/">← 메인으로 돌아가기</Link>
    </div>
  );
}
