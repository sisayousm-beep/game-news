"""기계적 수집 실행: 시드 + 스팀 가격. (커뮤니티는 갱신 워크플로에서 호출)

사용:  python -m scripts.collect          # backend/ 디렉토리에서
"""

import sys
from pathlib import Path

# Windows 콘솔(cp949)에서도 한글/특수문자 출력되도록
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import seed
from app.collectors import steam


def main():
    print("[1/2] 시드 …")
    seed.run()
    print("[2/2] 스팀 가격 수집 …")
    steam.collect()
    print("완료.")


if __name__ == "__main__":
    main()
