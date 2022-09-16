const pages = {
  "xck.html": { title: "通信大数据行程卡", type: 1 },
  "unit.html": { title: "场所码", type: 2 },
  "qr.html": { title: "扫码", type: 3 },
  "hs.html": { title: "苏康码", type: 4 },
  default: { title: "苏康码", type: 0 },
};

document.body.classList.add("hs-0", "ym-0");

window.addEventListener("load", () => {
  let page =
    pages[location.pathname.slice(location.pathname.lastIndexOf("/") + 1)] ||
    pages.default;
  try {
    window.top.setTitle(page.title);
  } catch (e) {}

  if (page.type == 1) {
    document.querySelector("#update-time").innerHTML = format2();
  } else if (page.type == 3) {
    qr();
  } else if (page.type == 4) {
    document.querySelector("#return-btn").addEventListener("click", () => {
      window.location.href = "main.html";
    });
  } else if (page.type == 0) {
    // text length: 160-180
    var o = `https://h5.dingtalk.com/healthAct/index.html?qrCode=V${randomStr(
      39,
      1
    )}&b=u${randomStr(4, 1)}${randomStr(2)}%2B${randomStr(29)}%2B${randomStr(
      26
    )}#/result`;
    $("#output").qrcode({
      render: "canvas",
      text: o,
      width: "230",
      height: "230",
      foreground: "green",
    });

    $("#now-time").html(format(new Date()));
    document.querySelector("#now-time").classList.remove("hidden");
    setInterval(function () {
      $("#now-time").html(format(new Date()));
    }, 500);

    document.querySelector("#xingchengBtn").addEventListener("click", () => {
      window.location.href = "xck.html";
    });

    document
      .querySelector(".hs-layout .hsym-footer")
      .addEventListener("click", () => {
        document
          .querySelector("#slider-sz")
          .classList.remove("stop-center", "stop-right");
        document.querySelector("#slider-sz").classList.add("stop-left");
      });

    Array.from(document.querySelectorAll(".hs-goback .slider-btn")).forEach(
      (el) => {
        el.addEventListener("click", () => {
          document
            .querySelector("#slider-sz")
            .classList.remove("stop-left", "stop-right");
          document.querySelector("#slider-sz").classList.add("stop-center");
        });
      }
    );
    Array.from(document.querySelectorAll("#hsjcJSBtn, #hsjcBtn")).forEach(
      (el) => {
        el.addEventListener("click", (el) => {
          window.location.href = "hs.html";
        });
      }
    );

    setPhone();
    setPersonalInfo();
    setHstatus();
    setYm();
    setXc();
    displayLatestHs();
  }
});

function getBeijingTime(offset = 0) {
  // create Date object for current location
  var d = new Date();
  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  // get utc+8 time
  return new Date(utc + 3600000 * 8 + offset);
}

function format(e) {
  var a = getBeijingTime();
  (r = (a.getFullYear(), a.getMonth() + 1)),
    (d = a.getDate()),
    (o = a.getHours()),
    (t = a.getMinutes()),
    (i = a.getSeconds());
  return (
    r.toString().padStart(2, "0") +
    "-" +
    d.toString().padStart(2, "0") +
    " " +
    o.toString().padStart(2, "0") +
    ":" +
    t.toString().padStart(2, "0") +
    ":" +
    i.toString().padStart(2, "0")
  );
}

function formatDate(a) {
  a = a || getBeijingTime();
  let yyyy = a.getFullYear(),
    MM = (a.getMonth() + 1).toString().padStart(2, "0"),
    dd = a.getDate().toString().padStart(2, "0");
  return `${yyyy}-${MM}-${dd}`;
}

function format2(a) {
  a = a || getBeijingTime();
  let yyyy = a.getFullYear(),
    MM = (a.getMonth() + 1).toString().padStart(2, "0"),
    dd = a.getDate().toString().padStart(2, "0"),
    hh = a.getHours().toString().padStart(2, "0"),
    mm = a.getMinutes().toString().padStart(2, "0"),
    ss = a.getSeconds().toString().padStart(2, "0");
  return `${yyyy}.${MM}.${dd} ${hh}:${mm}:${ss}`;
}

function setPersonalInfo() {
  let name = localStorage.getItem("name");
  let code = localStorage.getItem("code");

  let search = location.search;
  try {
    if (window.top !== window) {
      search = window.top.location.search;
    }
  } catch (e) {}
  let searchParams = new URLSearchParams(search);
  let queryName = searchParams.get("name");
  let queryCode = searchParams.get("code");

  if (queryName && queryName !== name) {
    localStorage.setItem("name", queryName);
    name = queryName;
  }
  if (queryCode && queryCode !== code) {
    localStorage.setItem("code", queryCode);
    code = queryCode;
  }
  displayPersonalInfo(name, code);

  document
    .querySelector('*[data-fhcvalue="name"]')
    .addEventListener("dblclick", (e) => {
      e.stopPropagation();
      name = prompt("更改姓名为：", name || "");
      if (name !== null) {
        localStorage.setItem("name", name);
        displayPersonalInfo(name, code);
      }
    });
  document
    .querySelector('*[data-fhcvalue="code"]')
    .addEventListener("dblclick", (e) => {
      e.stopPropagation();
      code = prompt("更改 id 为：", code || "");
      if (code !== null) {
        localStorage.setItem("code", code);
        displayPersonalInfo(name, code);
      }
    });
}

function displayPersonalInfo(name, code) {
  name = name || "刘洋";
  code = code || "";
  let code1 = code.length >= 6 ? code.slice(0, 3) : "320";
  let code2 = code.length >= 3 ? code.slice(-3) : "042";
  document.querySelector('*[data-fhcvalue="name"]').innerHTML = name;
  document.querySelector(
    '*[data-fhcvalue="code"]'
  ).innerHTML = `${code1}******${code2}`;
}

function setXc() {
  let xcEl = document.querySelector('*[data-fhcvalue="xcstatus"]');
  if (xcEl) {
    xcEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      let xc = (parseInt(localStorage.getItem("xc") || 0) + 1) % 3;
      localStorage.setItem("xc", xc);
      displayXc();
    });
    displayXc();
  }
}

function displayXc() {
  let xc = parseInt(localStorage.getItem("xc") || 0);
  document.body.classList.remove("xc-0", "xc-1", "xc-2");
  document.body.classList.add("xc-" + xc);
}

function setArea() {
  document.querySelector("#area").addEventListener("dblclick", (e) => {
    e.stopPropagation();
    let area = prompt("更改区域为：", localStorage.getItem("area") || "");
    if (area != null && area != localStorage.getItem("area")) {
      localStorage.setItem("area", area);
      displayArea();
    }
  });
  displayArea();
}

function displayArea() {
  let area = localStorage.getItem("area") || "江苏省南京市";
  let xc = parseInt(localStorage.getItem("xc") || 0);
  document.querySelector("#area").innerHTML =
    xc != 2
      ? area
      : `${area}*（注：*表示当前该城市存在中风险或高风险地区，并不表示用户实际到访过这些中高风险地区。）`;
}

function setPhone() {
  document
    .querySelector('*[data-fhcvalue="phone"]')
    .addEventListener("dblclick", (e) => {
      e.stopPropagation();
      let phone = prompt("更改手机号为：", localStorage.getItem("phone") || "");
      if (phone != null && phone != localStorage.getItem("phone")) {
        localStorage.setItem("phone", phone);
        displayPhone();
      }
    });
  displayPhone();
}

function displayPhone() {
  let phone = localStorage.getItem("phone") || "15000000042";
  document.querySelector('*[data-fhcvalue="phone"]').innerHTML = `${phone.slice(
    0,
    3
  )}****${phone.slice(-4)}`;
}

function setUnit() {
  displayUnit();
  var items = [
    {
      name: "删除当前场所",
      fn: deleteUnit,
    },
    {
      name: "删除所有场所",
      fn: deleteAllUnits,
    },
    {
      name: "新增场所",
      fn: addUnit,
    },
  ];
  var menu = new ContextMenu(".address", items);
  document.querySelector(".address").addEventListener("dblclick", toggleUnit);
}

function displayUnit() {
  document.querySelector("#unitName").innerHTML =
    localStorage.getItem("unitName") || "";
  document.querySelector("#unitAddress").innerHTML =
    localStorage.getItem("unitAddress") || "";
}

function deleteAllUnits() {
  if (!confirm("确认删除所有场所？")) {
    return;
  }
  localStorage.setItem("unitName", "");
  localStorage.setItem("unitAddress", "");
  localStorage.setItem("units", "[]");
  displayUnit();
}

function deleteUnit() {
  let unitName = localStorage.getItem("unitName") || "";
  let unitAddress = localStorage.getItem("unitAddress") || "";
  if (!unitName) {
    return;
  }
  if (!confirm(`删除当前场所 ${unitName} ？`)) {
    return;
  }
  let units = getUnits();
  try {
    let index = units.findIndex((unit) => unit.startsWith(unitName + "|"));
    if (index == -1) {
      return;
    }
    units.splice(index, 1);
    localStorage.setItem("units", JSON.stringify(units));
    let unit =
      units.length > 0
        ? index < units.length
          ? units[index]
          : units[0]
        : null;
    if (unit) {
      [unitName, unitAddress] = unit.split("|");
    } else {
      unitName = unitAddress = "";
    }
    localStorage.setItem("unitName", unitName);
    localStorage.setItem("unitAddress", unitAddress);
    displayUnit();
  } catch (e) {}
}

function addUnit() {
  let unitInfo = prompt(`请输入场所的名称和地址(使用 "," 或 "|" 分割)`, "");
  if (!unitInfo) {
    return;
  }
  let [unitName, unitAddress] = unitInfo.split(/\s*[,，|]\s*/);
  if (!unitAddress) {
    let index = unitInfo.lastIndexOf("江苏");
    if (index == -1) {
      index = unitInfo.lastIndexOf("南京");
    }
    if (index > 0) {
      unitName = unitInfo.slice(0, index);
      unitAddress = unitInfo.slice(index);
    }
  }
  unitName = unitName.trim();
  unitAddress = unitAddress.trim();
  if (!unitName || !unitAddress) {
    return;
  }
  let units = getUnits();
  try {
    units.push(unitName + "|" + unitAddress);
    localStorage.setItem("unitName", unitName);
    localStorage.setItem("unitAddress", unitAddress);
    localStorage.setItem("units", JSON.stringify(units));
    displayUnit();
  } catch (e) {}
}

function toggleUnit() {
  let unitName = localStorage.getItem("unitName") || "";
  let unitAddress = localStorage.getItem("unitAddress") || "";
  let units = getUnits();
  try {
    let index = unitName
      ? units.findIndex((unit) => unit.startsWith(unitName + "|"))
      : -1;
    if (index != -1) {
      index = (index + 1) % units.length;
    } else if (units.length) {
      index = 0;
    }
    if (index != -1) {
      [unitName, unitAddress] = units[index].split("|");
    } else {
      unitName = unitAddress = "";
    }
    localStorage.setItem("unitName", unitName);
    localStorage.setItem("unitAddress", unitAddress);
    displayUnit();
  } catch (e) {}
}

function getUnits() {
  let units = [];
  try {
    units = JSON.parse(localStorage.getItem("units"));
    if (!Array.isArray(units)) {
      units = [];
    }
  } catch (e) {}
  return units;
}

async function qr() {
  const video = document.querySelector("video");

  const constraints = {
    video: {
      facingMode: "environment",
    },
    audio: false,
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  await sleep(1000);
  location.href = "unit.html";
}

function sleep(miliseconds) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

function setYm() {
  let ymEl = document.querySelector('*[data-fhcvalue="ym"]');
  if (ymEl) {
    ymEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      let ym = (parseInt(localStorage.getItem("ym") || 0) + 1) % 2;
      localStorage.setItem("ym", ym);
      displayYm();
    });
    displayYm();
  }
}

function setHstatus() {
  let hstatusEl = document.querySelector('*[data-fhcvalue="hstatus"]');
  if (hstatusEl) {
    hstatusEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      let hstatus = (parseInt(localStorage.getItem("hstatus") || 0) + 1) % 2;
      localStorage.setItem("hstatus", hstatus);
      displayHstatus();
    });
    displayHstatus();
  }
}

function displayYm() {
  let ym = parseInt(localStorage.getItem("ym") || 0);
  document.body.classList.remove("ym-0", "ym-1");
  document.body.classList.add("ym-" + ym);
}

function displayHstatus() {
  let hstatus = parseInt(localStorage.getItem("hstatus") || 0);
  document.body.classList.remove("hs-0", "hs-1");
  document.body.classList.add("hs-" + hstatus);
}

function displayHsBasicInfo() {
  let name = localStorage.getItem("name") || "刘洋";
  let code = localStorage.getItem("code") || "";
  let code1 = code.length >= 6 ? code.slice(0, 6) : "320101";
  let code2 = code.length >= 4 ? code.slice(-4) : "0042";
  document.querySelector(".code1").innerHTML = code1;
  document.querySelector(".code2").innerHTML = code2;
  Array.from(document.querySelectorAll(".name")).forEach(
    (el) => (el.innerHTML = name)
  );
}

function getHs() {
  let hs = [];
  try {
    hs = JSON.parse(localStorage.getItem("hs"));
    if (!Array.isArray(hs)) {
      hs = [];
    }
  } catch (e) {}
  return hs;
}

function setHs() {
  displayHs();
  Array.from(document.querySelectorAll(".loc")).forEach((el) => {
    el.addEventListener("dblclick", (ev) => {
      let hs = getHs();
      let index = ev.target.dataset.index;
      let loc = prompt("采样点:", hs[index]?.[0] || "");
      if (!loc) {
        return;
      }
      hs[index] = hs[index] || [];
      hs[index][0] = loc;
      localStorage.setItem("hs", JSON.stringify(hs));
      displayHs();
    });
  });
  Array.from(document.querySelectorAll(".time")).forEach((el) => {
    el.addEventListener("dblclick", (ev) => {
      let hs = getHs();
      let index = ev.target.dataset.index;
      let time = prompt("采样时间(yyyy-MM-dd HH:mm):", hs[index]?.[1] || "");
      if (!time) {
        return;
      }
      hs[index] = hs[index] || [];
      hs[index][1] = time;
      localStorage.setItem("hs", JSON.stringify(hs));
      displayHs();
    });
  });
}

const fakeHsTimes = {
  0: "20:01",
  1: "20:24",
  2: "20:42",
  3: "20:58",
  4: "21:23",
};

function displayHs() {
  displayHsBasicInfo();
  let hs = getHs();
  let defaultLoc = hs[0]?.[0] || "社区采样点";
  Array.from(document.querySelectorAll(".loc")).forEach((el) => {
    el.innerHTML = hs[el.dataset.index]?.[0] || defaultLoc;
  });
  Array.from(document.querySelectorAll(".time")).forEach((el, i) => {
    let faketime =
      formatDate(getBeijingTime(-86400 * 1000 * (1 + i * 2))) +
      " " +
      (hs[i] && hs[i][1] ? hs[i][1].slice(-5) : fakeHsTimes[i]);
    el.innerHTML = hs[i] && hs[i][1] > faketime ? hs[i][1] : faketime;
  });
}

function displayLatestHs() {
  let hs = getHs();
  document.querySelector('*[data-fhcvalue="latesthsloc"]').innerHTML =
    hs[0]?.[0] || "社区采样点";
  let faketime =
    formatDate(getBeijingTime(-86400 * 1000)) + " " + fakeHsTimes[0];
  document.querySelector('*[data-fhcvalue="latesthstime"]').innerHTML =
    hs[0] && hs[0][1] > faketime ? hs[0][1] : faketime;
}

function randomStr(length, type) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (type == 1) {
    characters = "0123456789abcdef";
  }
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
