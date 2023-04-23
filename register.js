//VUE
Vue.createApp({
  data() {
    return {
      token: "",
      nickname: "",

      email: "",
      password: "",
      nickname: "",
      checkpassword: "",

      emptyEmailError: "",
      emptyPasswordError: "",
      emptynicknameError: "",
      emptycheckpasswordError: "",
    };
  },

  methods: {
    //驗證欄位空值
    vertify() {
      if (this.email.trim() == "") {
        this.emptyEmailError = "帳號尚未填寫";
      }
      if (this.nickname.trim() == "") {
        this.emptynicknameError = "暱稱尚未填寫";
      }
      if (this.password.trim() == "") {
        this.emptyPasswordError = "密碼尚未填寫";
      }
      if (this.checkpassword.trim() == "") {
        this.emptycheckpasswordError = "確認密碼尚未填寫";
      }
    },
    // 註冊
    signUp() {
      this.vertify();
      let obj = {
        user: {
          email: this.email,
          nickname: this.nickname,
          password: this.password,
        },
      };
      if (
        this.email === "" ||
        this.password === "" ||
        this.nickname === "" ||
        this.checkpassword === ""
      ) {
        return;
      } else if (this.password.length < 5) {
        Swal.fire("註冊失敗", "密碼不得少於六位數", "warning");
        this.clear();
      } else if (this.password !== this.checkpassword) {
        Swal.fire("註冊失敗", "密碼前後不一致，請重新確認", "warning");
        this.clear();
      } else {
        axios
          .post("https://todoo.5xcamp.us/users", obj)
          .then((response) => {
            if (response.data.message == "註冊成功") {
              Swal.fire("註冊成功", "恭喜", "success").then(() => {
                location.href = "index.html";
              });
            }
          })
          .catch((error) => {
            Swal.fire("註冊失敗", "此帳號已被使用", "warning");
            this.clear();
          });
      }
    },
  },
  mounted() {},
}).mount("#app");
