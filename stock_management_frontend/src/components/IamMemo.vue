<template>
  <div class="memo">
    <div class="act">
      <div class="bootstrap-iso">
        <input
          type="text"
          class="form-control is-invalid"
          id="barcode_input"
          @keyup.enter="add()"
          v-model="state.form.message"
          ref="cursor"
          placeholder="바코드를 입력하려면 여기를 터치해주세요."
          autofocus
        />
      </div>
    </div>
    <div class="button_event">
      <button
        type="button"
        class="btn btn-success"
        style="margin: 15px 5px 0 5px"
        @click="button_receive()"
      >
        입고 등록
      </button>
      <button
        type="button"
        class="btn btn-primary"
        style="margin: 15px 5px 0 5px"
        @click="button_deliver()"
      >
        출고 등록
      </button>
      <button
        type="button"
        class="btn btn-warning"
        style="margin: 15px 5px 0 5px"
        @click="button_bad()"
      >
        불량 등록
      </button>
      <span class="init">
        <button
          type="button"
          class="btn btn-danger"
          style="margin: 15px 5px 0 5px"
          @click="button_init()"
        >
          초기화
        </button>
      </span>
    </div>

    <ul>
      <li v-for="d in state.data" :key="d.id">
        <button
          type="button"
          class="close"
          aria-label="Close"
          :key="d.id"
          @click="remove(d.id)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div>
          원재료코드 : <strong>{{ d.content }}</strong>
        </div>
        <div>품명 : {{ d.name }}</div>
        <div>규격 : {{ d.size }}</div>
        <div class="number_box">
          수량
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            :key="d.id"
            @click="edit_minus(d.id)"
          >
            －
          </button>
          <strong class="number" :key="d.id" @click="edit_manual(d.id)">{{
            d.number
          }}</strong>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :key="d.id"
            @click="edit_plus(d.id)"
          >
            ＋
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive } from 'vue'
import axios from 'axios'
export default {
  data() {
    return { message: '' }
  },
  setup() {
    const state = reactive({
      data: [],
      form: { message: '' }
    })
    // 추가
    const add = () => {
      const content = state.form.message

      if (!content) {
        alert('입력한 내용이 없습니다.')
        return
      }
      if (state.data.find((d) => d.content === content)) {
        alert('이미 입력된 내용입니다.')
        state.form.message = ''
        return
      }
      axios.post('/api/memos', { content }).then((res) => {
        state.data = res.data
      })
      state.form.message = ''
    }
    // 1 더하기 수정
    const edit_plus = (id) => {
      const number = +1
      state.data.find((d) => d.id === id).number

      axios.put('/api/memos/plus/' + id, { number }).then((res) => {
        state.data = res.data
      })
    }

    // 1 마이너스 수정
    const edit_minus = (id) => {
      const number = -1
      state.data.find((d) => d.id === id).number

      axios.put('/api/memos/minus/' + id, { number }).then((res) => {
        state.data = res.data
      })
    }

    // 수량 메뉴얼 수정
    const edit_manual = (id) => {
      const num = prompt(
        '변경할 숫자 입력',
        state.data.find((d) => d.id === id).number
      )
      if (!num) {
        alert('입력한 내용이 없습니다.')
        return
      }
      state.data.find((d) => d.id === id).number

      axios.put('/api/memos/manual/' + id, { num }).then((res) => {
        state.data = res.data
      })
    }

    // 삭제
    const remove = (id) => {
      axios.delete('/api/memos/' + id).then((res) => {
        state.data = res.data
      })
    }

    // 입고
    const receive = () => {
      console.log('입고버튼을 눌렀습니다.')
      axios.post('/api/memos/receive').then((res) => {
        alert('입고 등록되었습니다.')
        state.data = res.data
      })
    }
    // 출고
    const deliver = () => {
      console.log('출고버튼을 눌렀습니다.')
      axios.post('/api/memos/deliver').then((res) => {
        alert('출고 등록되었습니다.')
        state.data = res.data
      })
    }
    // 불량
    const bad = () => {
      console.log('불량버튼을 눌렀습니다.')
      axios.post('/api/memos/bad').then((res) => {
        alert('불량 등록되었습니다.')
        state.data = res.data
      })
    }

    // 목록 초기화
    const init = () => {
      axios.post('/api/memos/init').then((res) => {
        state.data = res.data
      })
    }

    axios.get('/api/memos').then((res) => {
      state.data = res.data
    })
    return {
      state,
      add,
      edit_plus,
      edit_minus,
      edit_manual,
      remove,
      receive,
      deliver,
      bad,
      init
    }
  },
  mounted() {
    this.startCursor()
  },
  methods: {
    startCursor() {
      this.$refs.cursor.focus()
    },
    button_receive() {
      if (confirm('입고 등록하시겠습니까?') == true) {
        this.receive()
      } else {
        return
      }
    },
    button_deliver() {
      if (confirm('출고 등록하시겠습니까?') == true) {
        this.deliver()
      } else {
        return
      }
    },
    button_bad() {
      if (confirm('불량 등록하시겠습니까?') == true) {
        this.bad()
      } else {
        return
      }
    },
    button_init() {
      if (confirm('목록을 초기화 하시겠습니까?') == true) {
        this.init()
      } else {
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.memo {
  .act {
    text-align: right;
    padding: 10px 10px 5px 5px;
  }
  .button_event {
    span.init {
      float: right;
    }
  }
  ul {
    list-style: none;
    padding: 15px;
    margin: 0;
    li {
      padding: 15px;
      margin: 10px 0;
      border: 1px solid #eee;
    }
    div.number_box {
      text-align: right;
    }
    strong.number {
      margin: 10px;
    }
  }
}
.bootstrap-iso .formden_header h2,
.bootstrap-iso .formden_header p,
.bootstrap-iso form {
  font-family: Arial, Helvetica, sans-serif;
  color: black;
}
.bootstrap-iso form button,
.bootstrap-iso form button:hover {
  color: white !important;
}
.bootstrap-iso .form-control:focus {
  border-color: #e96666;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
}
.asteriskField {
  color: red;
}
</style>
