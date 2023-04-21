// // 登入功能signIn()
// const signIn = () => {
//   let obj = {
//     user: {
//       email: email.value,
//       password: pwd.value,
//     },
//   };
//   axios
//     .post("https://todoo.5xcamp.us/users/sign_in", obj)
//     .then((response) => {
//       console.log(response.data);
//       if (response.data.message == "登入成功") {
//         token = response.headers.authorization;
//         nickname = response.data.nickname;
//         localStorage.setItem("authorization", token);
//         localStorage.setItem("nickname", nickname);
//         location.href = "todo.html";
//       }
//     })
//     .catch((error) => console.log(error));
// };

// // 登入監聽
// sign_in.addEventListener("click", () => {
//   vertify();
//   signIn();
// });

// // ENTER 登入
// const enter = (e) => {
//   if (e.keyCode !== 13) {
//     return;
//   }
//   vertify();
//   signIn();
// };

//VUE
Vue.createApp({
  data() {
    return {
      token: "",
      nickname: "",
      email: "",
      password: "",
      checkemail: "",
      checkpassword: "",
      emptyEmailError: "",
      emptyPasswordError: "",
    };
  },

  methods: {
    //驗證欄位空值
    vertify() {
      if (this.email.trim() == "") {
        this.emptyEmailError = "帳號尚未填寫";
      }
      if (this.password.trim() == "") {
        this.emptyPasswordError = "密碼尚未填寫";
      }
    },
    //登入
    logIn() {
      this.vertify();
      let obj = {
        user: {
          email: this.email,
          password: this.password,
        },
      };
      axios
        .post("https://todoo.5xcamp.us/users/sign_in", obj)
        .then((response) => {
          console.log(response.data);
          if (response.data.message == "登入成功") {
            this.token = response.headers.authorization;
            this.nickname = response.data.nickname;
            localStorage.setItem("authorization", this.token);
            localStorage.setItem("nickname", this.nickname);
            location.href = "todo.html";
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.message == "Request failed with status code 401") {
            Swal.fire("登入失敗", "請先註冊帳號", "error");
          }
        });
    },
    onPressEnter() {
      this.logIn();
    },
  },
  mounted() {
    console.log(this.email);
  },
}).mount("#app");
