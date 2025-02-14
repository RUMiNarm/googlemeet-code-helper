(function () {
  function createCodePanel(codes, autoJoin) {
    // Meetのコード入力欄を探す
    const inputField = document.querySelector("input[jsname='YPqjbf']");
    if (!inputField) return;

    // 入力欄の親要素を取得
    const inputContainer = inputField.closest('div');
    if (!inputContainer) return;

    // 既にパネルが存在する場合は削除
    let existingPanel = document.getElementById('meet-code-panel');
    if (existingPanel) {
      existingPanel.remove();
    }

    // パネルの作成
    const panel = document.createElement('div');
    panel.id = 'meet-code-panel';

    // コードリスト表示
    codes.forEach((code) => {
      const btn = document.createElement('button');
      btn.textContent = code;

      // クリックでコードを入力 & 参加ボタンを押す
      btn.onclick = function () {
        chrome.storage.sync.get('autoJoin', function (data) {
          insertCodeAndClickJoin(code, data.autoJoin !== false);
        });
      };

      panel.appendChild(btn);
    });

    // Meetのコード入力欄の下にパネルを挿入
    inputContainer.parentNode.insertBefore(panel, inputContainer.nextSibling);
  }

  // Meetのページでコード入力 & 参加ボタンをクリック
  function insertCodeAndClickJoin(code, autoJoin) {
    const input = document.querySelector("input[jsname='YPqjbf']");
    if (input) {
      input.value = code;

      // inputイベントを発火
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      input.dispatchEvent(inputEvent);

      // 自動参加が有効であれば
      if (autoJoin) {
        // 500ms 待って参加ボタンをクリック
        setTimeout(() => {
          const joinButton = document.querySelector("button[jsname='r9ERUc'], button[data-idom-class*='Nggy9b']");
          if (joinButton) {
            joinButton.click();
          } else {
            console.warn('参加ボタンが見つかりません。');
          }
        }, 500);
      }
    } else {
      console.warn('Meetの入力欄が見つかりません。');
    }
  }

  // Meetのページが読み込まれるのを監視する
  function waitForMeetUI() {
    const observer = new MutationObserver(() => {
      const inputField = document.querySelector("input[jsname='YPqjbf']");
      if (inputField) {
        chrome.storage.sync.get('meetCodes', function (data) {
          createCodePanel(data.meetCodes || []);
        });
        observer.disconnect(); // 監視を終了
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // **ストレージが更新されたらリストを自動更新**
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.meetCodes) {
      chrome.storage.sync.get('meetCodes', function (data) {
        createCodePanel(data.meetCodes || []);
      });
    }
  });

  waitForMeetUI();
})();
