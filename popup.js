document.addEventListener('DOMContentLoaded', function () {
  const codeInput = document.getElementById('codeInput');
  const addCodeButton = document.getElementById('addCode');
  const codeList = document.getElementById('codeList');

  // コードをロードする
  function loadCodes() {
    chrome.storage.sync.get('meetCodes', function (data) {
      const codes = data.meetCodes || [];
      codeList.innerHTML = '';
      codes.forEach((code, index) => {
        const li = document.createElement('li');
        li.textContent = code;

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = function () {
          codes.splice(index, 1);
          chrome.storage.sync.set({ meetCodes: codes }, loadCodes);
        };

        li.appendChild(deleteBtn);
        codeList.appendChild(li);
      });
    });
  }

  // コードを追加する
  addCodeButton.addEventListener('click', function () {
    const newCode = codeInput.value.trim();
    if (!newCode) return;

    chrome.storage.sync.get('meetCodes', function (data) {
      const codes = data.meetCodes || [];
      if (!codes.includes(newCode)) {
        codes.push(newCode);
        chrome.storage.sync.set({ meetCodes: codes }, function () {
          codeInput.value = '';
          loadCodes();
        });
      }
    });
  });

  loadCodes();
});
