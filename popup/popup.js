document.addEventListener('DOMContentLoaded', function () {
  const codeInput = document.getElementById('codeInput');
  const addCodeButton = document.getElementById('addCode');
  const codeList = document.getElementById('codeList');
  const autoJoinToggle = document.getElementById('autoJoinToggle');

  // ストレージから設定をロード
  function loadSettings() {
    chrome.storage.sync.get(['meetCodes', 'autoJoin'], function (data) {
      const codes = data.meetCodes || [];
      codeList.innerHTML = '';
      codes.forEach((code, index) => {
        const li = document.createElement('li');
        li.textContent = code;

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.textContent = '❌';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = function () {
          codes.splice(index, 1);
          chrome.storage.sync.set({ meetCodes: codes }, loadSettings);
        };

        li.appendChild(deleteBtn);
        codeList.appendChild(li);
      });

      // トグルボタンの状態を設定
      autoJoinToggle.checked = data.autoJoin !== false; // デフォルトはON
    });
  }

  // コードを追加する
  function addCode() {
    const newCode = codeInput.value.trim();
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (!newCode) {
      // alert('空白のコードは追加できません。');
      return;
    }
    if (!alphanumericRegex.test(newCode)) {
      // alert('半角英数字のみ入力可能です。');
      return;
    }

    chrome.storage.sync.get('meetCodes', function (data) {
      const codes = data.meetCodes || [];
      if (!codes.includes(newCode)) {
        codes.push(newCode);
        chrome.storage.sync.set({ meetCodes: codes }, function () {
          codeInput.value = '';
          loadSettings();
        });
      }
    });
  }

  // 追加ボタンのクリックでコードを追加
  addCodeButton.addEventListener('click', addCode);

  // Enterキーでコードを追加
  codeInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCode();
    }
  });

  // 自動参加の設定を保存
  autoJoinToggle.addEventListener('change', function () {
    chrome.storage.sync.set({ autoJoin: autoJoinToggle.checked });
  });

  loadSettings();
});
