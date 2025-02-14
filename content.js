(function () {
  function createCodePanel(codes) {
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
    panel.style.width = '100%';
    panel.style.marginTop = '10px';
    panel.style.padding = '8px';
    panel.style.background = '#F8F9FA'; // Meetの背景色と統一
    panel.style.borderRadius = '8px';
    panel.style.display = 'flex';
    panel.style.flexWrap = 'wrap';
    panel.style.alignItems = 'center';
    panel.style.justifyContent = 'flex-start';
    panel.style.gap = '8px';

    // コードリスト表示
    codes.forEach((code, index) => {
      const btn = document.createElement('button');
      btn.textContent = code;
      btn.style.padding = '8px 12px';
      btn.style.background = '#FFFFFF';
      btn.style.border = '1px solid #DADCE0';
      btn.style.borderRadius = '20px';
      btn.style.fontSize = '14px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'background 0.2s ease, transform 0.1s ease';
      btn.style.boxShadow = 'none';
      btn.style.color = '#3C4043';

      // ホバー時のエフェクト
      btn.onmouseover = () => (btn.style.background = '#E8F0FE');
      btn.onmouseout = () => (btn.style.background = '#FFFFFF');
      btn.onmousedown = () => (btn.style.transform = 'scale(0.95)');
      btn.onmouseup = () => (btn.style.transform = 'scale(1)');

      // クリックでコードを入力 & 参加ボタンを押す
      btn.onclick = function () {
        insertCodeAndClickJoin(code);
      };

      panel.appendChild(btn);
    });

    // Meetのコード入力欄の下にパネルを挿入
    inputContainer.parentNode.insertBefore(panel, inputContainer.nextSibling);
  }

  // Meetのページでコード入力 & 参加ボタンをクリック
  function insertCodeAndClickJoin(code) {
    const input = document.querySelector("input[jsname='YPqjbf']");
    if (input) {
      input.value = code;

      // inputイベントを発火
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      input.dispatchEvent(inputEvent);

      // 500ms 待って参加ボタンをクリック
      setTimeout(() => {
        // 参加ボタンを正しく取得する
        const joinButton = document.querySelector("button[jsname='r9ERUc'], button[data-idom-class*='Nggy9b']");

        if (joinButton) {
          joinButton.click();
        } else {
          console.warn('参加ボタンが見つかりません。');
        }
      }, 500);
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
