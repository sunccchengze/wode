#!/usr/bin/env bash
# check.sh — 指挥舱全量自检。三套测试全绿才算过。
#
#   ./check.sh                    # 用 fixture 样本仓跑
#   ZIXUE_REPO=/path/to/zixue2026 ./check.sh   # 额外跑真仓库交叉验证
#
# 依赖：python3、node（>=18）、jsdom（只给 DOM 冒烟测试用，见 tests/dom_smoke.mjs）
set -uo pipefail
cd "$(dirname "$0")"

fail=0

echo "════ 1/3 · 收割器回归（Python）════"
if python3 -m unittest discover -s tests -p 'test_*.py' 2>&1 | tail -4; then :; else fail=1; fi

echo
echo "════ 2/3 · 调度器 + 双解析器交叉验证（Node）════"
if node --test tests/*.mjs 2>&1 | grep -E "^(not ok|# (tests|pass|fail))"; then :; else fail=1; fi

echo
echo "════ 3/3 · 真 DOM 冒烟（jsdom 载入真实 index.html + app.js）════"
if node tests/dom_smoke.mjs 2>&1 | tail -3; then :; else fail=1; fi

echo
if [ "$fail" -eq 0 ]; then
  echo "✅ 三套测试全绿"
else
  echo "❌ 有测试没过"
fi
exit "$fail"
