//VUE
Vue.createApp({
  data() {
    return {
      token: localStorage.getItem("authorization"),
      nickname: localStorage.getItem("nickname"),
      url: "https://todoo.5xcamp.us",
      data: [],
      textContent: "",
      Done: [],
      notDone: [],
      showNotDoneMessage: true,
      showDoneMessage: false,
      showall: true,
      showNotDone: false,
      showDone: false,
    };
  },

  methods: {
    test() {
      console.log(this.token);
      console.log(this.nickname);
      console.log(this.url);
    },
    click() {
      2 > 1;
    },
    // 沒有token就登出
    tokentest() {
      axios
        .get(`${this.url}/check`, {
          headers: {
            authorization: this.token,
          },
        })
        .then((res) => {
          this.getTodo();
          // console.log(res);
        })
        .catch(() => {
          location.href = "index.html";
        });
    },
    // 取得
    getTodo() {
      axios
        .get(`${this.url}/todos`, {
          headers: {
            authorization: this.token,
          },
        })
        .then((response) => {
          // console.log(response.data);
          this.data = response.data.todos;
          this.count();
        });
    },
    addItem() {
      if (this.textContent.trim() === "") {
        Swal.fire("新增失敗", "請輸入內容再新增", "warning");
      } else {
        let addObj = {
          todo: {
            content: this.textContent,
          },
        };

        //輸入後表單清空
        this.textContent = "";
        // 戳新增API
        axios
          .post(`${this.url}/todos`, addObj, {
            headers: {
              authorization: this.token,
            },
          })
          .then((response) => {
            this.data.push(response.data);
            this.getTodo();

            Swal.fire("成功", "新增一筆代辦事項", "success");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    checkBoxToDone(targetId, index) {
      axios
        .patch(`${this.url}/todos/${targetId}/toggle`, "", {
          headers: {
            authorization: this.token,
          },
        })
        .then((res) => {
          Swal.fire("成功", "已成功切換狀態", "success");
          this.data.splice(index, 1, res.data);
          this.count();
        });
    },
    deleteItem(targetId, index) {
      Swal.fire({
        title: "請確認",
        text: "一但刪除將無法回復",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定刪除",
        cancelButtonText: "再想想",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("已刪除", "您的代辦事項刪除成功", "success");
          console.log(targetId);
          axios
            .delete(`${this.url}/todos/${targetId}`, {
              headers: {
                authorization: this.token,
              },
            })
            .then((res) => {
              this.data.splice(index, 1);
              this.count();
            });
        } else {
          return;
        }
      });
    },
    cleanDone(targetId, index) {
      Swal.fire({
        title: "請確認是否刪除全部",
        text: "一但刪除將無法回復",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定刪除",
        cancelButtonText: "再想想",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("已刪除", "您的所有已完成事項刪除成功", "success");
          Promise.all(
            this.Done.map((item) => {
              return axios.delete(`${this.url}/todos/${item.id}`, {
                headers: {
                  authorization: this.token,
                },
              });
            })
          ).then(() => {
            // this.data.splice(this.Done, this.Done.length);
            this.data = this.data.filter((item) => {
              return item.completed_at === null;
            });

            this.count();
          });
        } else {
          return;
        }
      });
      // this.data.splice(this.Done, this.Done.length);
      // this.count();
    },
    count() {
      this.notDone = this.data.filter((item) => {
        return item.completed_at === null;
      });
      this.Done = this.data.filter((item) => {
        return item.completed_at !== null;
      });
    },
    all() {
      this.showDoneMessage = false;
      this.showNotDoneMessage = true;
      this.showall = true;
      this.showDone = false;
      this.showNotDone = false;
    },
    not() {
      this.notDone = this.data.filter((item) => {
        return item.completed_at === null;
      });

      this.showDoneMessage = false;
      this.showNotDoneMessage = true;
      this.showall = false;
      this.showDone = false;
      this.showNotDone = true;
    },
    done() {
      this.Done = this.data.filter((item) => {
        return item.completed_at !== null;
      });

      this.showDoneMessage = true;
      this.showNotDoneMessage = false;
      this.showall = false;
      this.showNotDone = false;
      this.showDone = true;
    },

    logOut() {
      axios
        .delete(`${this.url}/users/sign_out`, {
          headers: {
            authorization: this.token,
          },
        })
        .then((response) => {
          localStorage.removeItem("authorization");
          localStorage.removeItem("nickname");
          Swal.fire("登出成功", "歡迎下次使用", "success").then(() => {
            location.href = "index.html";
          });
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("登出失敗", "error");
        });
    },
  },
  mounted() {
    this.tokentest();
    this.count();
    this.getTodo();
  },
}).mount("#app");
