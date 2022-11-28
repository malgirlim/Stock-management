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
      <li v-for="d in state.data" :key="d.content">
        <span class="close">
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            :key="d.content"
            @click="remove(d.content)"
          ></button>
        </span>
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
            :key="d.content"
            @click="edit_minus(d.content)"
          >
            －
          </button>
          <span class="number">
            <strong
              class="number"
              :key="d.content"
              @click="edit_manual(d.content)"
              >{{ d.number }}</strong
            ></span
          >
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :key="d.content"
            @click="edit_plus(d.content)"
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
import Swal from 'sweetalert2'

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
      const content = state.form.message.trim()

      if (!content) {
        Swal.fire({
          icon: 'info',
          title: '<div style="font-size:90%">입력한 코드가 없습니다.</div>',
          showConfirmButton: false,
          timer: 1000
        })
        return
      }
      if (state.data.find((d) => d.content === content)) {
        Swal.fire({
          icon: 'error',
          title: '<div style="font-size:90%">이미 입력된 코드입니다.</div>',
          showConfirmButton: false,
          timer: 1000
        })
        state.form.message = ''
        return
      }
      axios.post('/api/memos', { content }).then((res) => {
        if (res.data[0] != null) {
          state.data = JSON.parse(localStorage.getItem('data'))
          // console.log(res.data[0])
          state.data.unshift(res.data[0])
          localStorage.setItem('data', JSON.stringify(state.data))
        } else {
          Swal.fire({
            icon: 'error',
            title:
              '<div style="font-size:90%">등록되지 않은 코드입니다.\n다시 입력해 주세요.</div>',
            showConfirmButton: false,
            timer: 1500
          })
          state.form.message = ''
          return
        }
      })
      state.form.message = ''
    }
    // 1 더하기 수정
    const edit_plus = (content) => {
      const number = +1
      var i = state.data.findIndex((d) => d.content === content)
      state.data[i].number = state.data[i].number + number
      localStorage.setItem('data', JSON.stringify(state.data))
    }

    // 1 마이너스 수정
    const edit_minus = (content) => {
      const number = -1
      var i = state.data.findIndex((d) => d.content === content)
      state.data[i].number = state.data[i].number + number
      localStorage.setItem('data', JSON.stringify(state.data))
    }

    // 수량 메뉴얼 수정
    const edit_manual = (content) => {
      Swal.fire({
        //title: '수정',
        icon: 'question',
        input: 'range',
        title: '수정',
        inputLabel: '수량을 입력해주세요',
        confirmButtonText: '확인',
        inputAttributes: {
          min: 0,
          max: 1000,
          step: 5
        },
        inputValue: state.data.find((d) => d.content === content).number
      }).then((result) => {
        const num = Number(result.value)
        if (!num) return
        var i = state.data.findIndex((d) => d.content === content)
        state.data[i].number = num
        localStorage.setItem('data', JSON.stringify(state.data))
      })
    }

    // 삭제
    const remove = (content) => {
      var i = state.data.findIndex((d) => d.content === content)
      state.data.splice(i, 1)
      localStorage.setItem('data', JSON.stringify(state.data))
    }

    // 입고
    const receive = () => {
      if (state.data.length < 1) {
        Swal.fire({
          icon: 'error',
          title: '<div style="font-size:90%">입력된 데이터가 없습니다.</div>',
          showConfirmButton: false,
          timer: 1000
        })
        return
      }
      axios.post('/api/memos/receive', state.data).then((res) => {
        Swal.fire({
          icon: 'success',
          title: '<div style="font-size:90%">등록되었습니다.</div>',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(res.data)
        localStorage.setItem('data', JSON.stringify([]))
        state.data = JSON.parse(localStorage.getItem('data'))
      })
    }
    // 출고
    const deliver = () => {
      if (state.data.length < 1) {
        Swal.fire({
          icon: 'error',
          title: '<div style="font-size:90%">입력된 데이터가 없습니다.</div>',
          showConfirmButton: false,
          timer: 1000
        })
        return
      }
      axios.post('/api/memos/deliver').then((res) => {
        Swal.fire({
          icon: 'success',
          title: '<div style="font-size:90%">등록되었습니다.</div>',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(res.data)
        localStorage.setItem('data', JSON.stringify([]))
        state.data = JSON.parse(localStorage.getItem('data'))
      })
    }
    // 불량
    const bad = () => {
      if (state.data.length < 1) {
        Swal.fire({
          icon: 'error',
          title: '<div style="font-size:90%">입력된 데이터가 없습니다.</div>',
          showConfirmButton: false,
          timer: 1000
        })
        return
      }
      axios.post('/api/memos/bad').then((res) => {
        Swal.fire({
          icon: 'success',
          title: '<div style="font-size:90%">등록되었습니다.</div>',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(res.data)
        localStorage.setItem('data', JSON.stringify([]))
        state.data = JSON.parse(localStorage.getItem('data'))
      })
    }

    // 목록 초기화
    const init = () => {
      Swal.fire({
        icon: 'success',
        title: '<div style="font-size:90%">초기화 되었습니다.</div>',
        showConfirmButton: false,
        timer: 1000
      })
      localStorage.setItem('data', JSON.stringify([]))
      state.data = JSON.parse(localStorage.getItem('data'))
    }

    axios.get('/api/memos').then(() => {
      if (localStorage.getItem('data') === null)
        localStorage.setItem('data', JSON.stringify([]))
      state.data = JSON.parse(localStorage.getItem('data'))
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
      Swal.fire({
        title: '입고',
        text: '입고 등록하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      }).then((result) => {
        if (result.isConfirmed) {
          this.receive()
        }
      })
    },
    button_deliver() {
      Swal.fire({
        title: '출고',
        text: '출고 등록하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deliver()
        }
      })
    },
    button_bad() {
      Swal.fire({
        title: '불량',
        text: '불량 등록하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      }).then((result) => {
        if (result.isConfirmed) {
          this.bad()
        }
      })
    },
    button_init() {
      Swal.fire({
        title: '초기화',
        text: '목록을 초기화 하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      }).then((result) => {
        if (result.isConfirmed) {
          this.init()
        }
      })
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
      span.close {
        float: right;
      }
    }
    div.number_box {
      text-align: right;
      span.number {
        border: 1px solid rgb(180, 180, 180);
        padding-top: 3px;
        padding-bottom: 6px;
        margin: 0 5px;
      }
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
