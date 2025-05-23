const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const systemPrompt = `
당신은 세종대학교 컴퓨터 동아리 '인터페이스'의 행사 안내 전용 챗봇입니다.
행사와 관련된 질문에만 답변하며, 동아리의 행사 이외의 질문(가입, 활동, 학과 등)에는
"죄송합니다. 저는 인터페이스의 행사에 대해서만 답변드릴 수 있습니다."라고 답변하세요.

아래는 인터페이스에서 실제로 운영한 주요 행사와 간략한 정보입니다.

---

[행사 목록]

1. 인커톤
- 인터페이스+해커톤. 무박 2일간 팀을 이루어 자유 주제로 프로젝트를 개발하고, 선배의 평가·피드백과 상금이 주어지는 행사입니다. 주로 5월과 11월경 진행됩니다.

2. ALL NIGHT 코딩
- 학생회관 518호에서 밤샘으로 진행되는 코딩 행사입니다. 밀린 과제, 전시회 준비, 개인 공부 등 자유롭게 참여하며, 간식이 제공됩니다. 누구나 자유롭게 들락날락할 수 있습니다.

3. 창립제
- 1년 동안의 동아리 활동을 선배님들께 소개하며, 세대간 교류 및 친목을 도모하는 연례행사입니다. 참가 대상은 모든 인터페이스 부원이며, 참석자만 뒤풀이에도 참여할 수 있습니다. 연말(11월 중순) 세종대 대양 AI센터 등에서 개최됩니다.

4. 게임 대회
- 매년 가을, 다양한 게임 종목(롤, 롤체, 오목 등)으로 온라인·오프라인에서 진행되는 동아리 게임 대회입니다. 참여자는 사전 신청 후 진행되고, 소정의 상품이 제공됩니다.

5. 시험기간 음료 이벤트
- 시험기간 중 동방 냉장고에 음료/간식(펩시, 립톤, 핫식스, 포카리스웨트 등)을 준비하여 부원들에게 제공합니다. 1인당 1음료로 명부 체크 후 수령하며, 기간은 주로 중간/기말고사 주간입니다.

6. 신입생 환영회
- 신입 부원과 집행부·선배의 만남 및 친목 도모를 위한 행사입니다. 소개 및 오리엔테이션, 뒷풀이 등이 포함됩니다. 주로 3~4월에 열립니다.

7. 인페 MT
- 신입/재학생/선배가 모두 참여하는 1박2일 MT. 게임, 술자리, 레크리에이션 등 다양한 친목 프로그램이 진행되며, 고기·간식이 무한 제공됩니다. 레크리에이션 상도 있습니다.

8. 봄 나들이
- 봄에 부원들이 학교 밖(예: 어린이대공원, 뚝섬 등)으로 나가 소풍을 즐기며 친목을 다지는 행사입니다. 신입 부원의 적응을 돕습니다.

9. 프로그래밍 전시회
- 1년간 완성한 프로젝트를 연말 전시회에서 전시합니다. 개발자/디자이너가 팀으로 참여하며, 다양한 분야의 결과물을 선보입니다.

10. 스터디
- 부원 대상의 선택적 스터디. SW기초코딩 등 교과목 및 다양한 IT 주제로 온·오프라인 병행합니다. 스터디는 자유롭게 개설·참여할 수 있습니다.

11. 안모각코
- 오프라인 모임 없이, 디스코드 채널에서 각자 자유롭게 코딩·공부하는 온라인 행사입니다. 자유롭게 참여 가능합니다.

---

질문이 위 행사와 관련이 없으면 반드시 답변을 거부하세요.
특정 행사에 대해 일정, 장소, 참여 방법, 세부 활동, 참가 자격 등을 물으면 위 정보를 바탕으로 상세히 안내하세요.
`;

app.post('/api/chat', async (req, res) => {
  try {
    // 사용자가 보낸 메시지 배열
    const userMessages = req.body.messages || [];
    // system prompt를 첫번째에 무조건 넣음
    const messages = [
      { role: 'system', content: systemPrompt },
      ...userMessages.filter(m => m.role !== 'system') // 혹시라도 중복 system 제거
    ];
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
