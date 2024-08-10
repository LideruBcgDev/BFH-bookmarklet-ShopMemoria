export default () => {
  function getStatusValues(item) {
    const statusElements = item.querySelectorAll('.unitParams__item');
    const status = {};
    
    statusElements.forEach((element) => {
      const label = element.querySelector('span').innerText;
      const value = element.querySelector('.unitParams__item__value').innerText;

      switch (label) {
        case 'HP':
          status.HP = parseInt(value, 10);
          break;
        case '攻撃':
          status.PHY = parseInt(value, 10);
          break;
        case '魔攻':
          status.INT = parseInt(value, 10);
          break;
        case '防御':
          status.VIT = parseInt(value, 10);
          break;
        case '魔防':
          status.MND = parseInt(value, 10);
          break;
        case '敏捷':
          status.AGI = parseInt(value, 10);
          break;
        default:
          break;
      }
    });
    status.ATK = parseInt(status.PHY + status.INT, 10);
    status.DEF = parseInt(status.VIT + status.MND, 10);
    
    const bpcElement = item.querySelectorAll('.status span')[1];
    if (bpcElement) {
      const bpcText = bpcElement.innerText;
      const bpcTextCleaned = bpcText.replace(/,/g, '');
      const bpcMatch = bpcTextCleaned.match(/(\d+)\s*BPC/);
      if (bpcMatch) {
        status.BPC = parseInt(bpcMatch[1], 10);
      }
    }
   
    return status;
  }

  function clickPagesSequentially() {
    var pagenationArea = document.querySelector('.pagenationArea');
    var pageNumbers = pagenationArea.querySelectorAll('.pagenation__numbering');
    var pageData  = [];

    return new Promise(function(resolve) {
      pageNumbers.forEach(function(page, index) {
        setTimeout(function() {
          page.click();

          setTimeout(function() {
            document.querySelectorAll('.tradeitembase').forEach((item) => {
              const status = getStatusValues(item);
              pageData.push(status);
            });
            
            if (index === pageNumbers.length - 1) {
              resolve(pageData);
            }
          }, 800);
        }, index * 1000);
      });
    });
  }

  function createDataTableDiv(jsonData) {
    const container = document.createElement('div');
    container.id = 'dataTableContainer';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.width = '95%';
    container.style.height = '95%';
    container.style.backgroundColor = 'white';
    container.style.zIndex = '1000';
    container.style.overflow = 'auto';
    container.style.padding = '20px';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    container.style.borderRadius = '8px';

    const closeButton = document.createElement('button');
    closeButton.textContent = '閉じる';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = 'none';
    closeButton.style.color = 'black';
    closeButton.style.borderRadius = '4px';
    closeButton.addEventListener('click', () => {
      container.remove();
    });

    const table = document.createElement('table');
    table.id = 'dataTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = 'black';
    table.style.marginTop = '40px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th><input type="text" placeholder=">=" style="width: 100%" id="hpGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="phyGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="intGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="vitGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="mndGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="agiGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="atkGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="defGreaterThan"></th>
        <th><input type="text" placeholder=">=" style="width: 100%" id="bpcGreaterThan"></th>
      </tr>
      <tr>
        <th><input type="text" placeholder="<=" style="width: 100%" id="hpLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="phyLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="intLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="vitLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="mndLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="agiLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="atkLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="defLessThan"></th>
        <th><input type="text" placeholder="<=" style="width: 100%" id="bpcLessThan"></th>
      </tr>
      <tr>
        <th>HP</th>
        <th>攻撃</th>
        <th>魔攻</th>
        <th>防御</th>
        <th>魔防</th>
        <th>敏捷</th>
        <th>攻撃+魔攻</th>
        <th>防御+魔防</th>
        <th>BPC</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    jsonData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.HP || ''}</td>
        <td>${item.PHY || ''}</td>
        <td>${item.INT || ''}</td>
        <td>${item.VIT || ''}</td>
        <td>${item.MND || ''}</td>
        <td>${item.AGI || ''}</td>
        <td>${item.ATK || ''}</td>
        <td>${item.DEF || ''}</td>
        <td>${item.BPC || ''}</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.datatables.net/1.10.25/css/jquery.dataTables.min.css';
    container.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    container.appendChild(script);
    script.onload = () => {
      const dataTableScript = document.createElement('script');
      dataTableScript.src = 'https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js';
      container.appendChild(dataTableScript);
      dataTableScript.onload = () => {
        const dataTable = $('#dataTable').DataTable({
          pageLength: 200,
          columnDefs: [
            { width: '15%', targets: [6, 7] },
            { width: '10%', targets: [0, 1, 2, 3, 4, 5] }
          ],
          autoWidth: false,
          "dom": 't', 
          "paging": false,
          "info": false,
          "searching": true,
        });

        $('#dataTable thead input').on('keyup change', function () {
          const column = $(this).parent().index();

          function clearColumnFilters(columnIndex) {
            dataTable.column(columnIndex).search('', true, false).draw();
          }

          function filterFunction(settings, data, dataIndex) {
            const cellValue = parseFloat(data[column].replace(/,/g, '')) || 0;
            let greaterThanValue = 0;
            let lessThanValue = 0;

            switch (column) {
              case 0:
                greaterThanValue = parseFloat($('#hpGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#hpLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 1:
                greaterThanValue = parseFloat($('#phyGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#phyLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 2:
                greaterThanValue = parseFloat($('#intGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#intLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 3:
                greaterThanValue = parseFloat($('#vitGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#vitLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 4:
                greaterThanValue = parseFloat($('#mndGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#mndLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 5:
                greaterThanValue = parseFloat($('#agiGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#agiLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 6:
                greaterThanValue = parseFloat($('#atkGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#atkLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 7:
                greaterThanValue = parseFloat($('#defGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#defLessThan').val().replace(/,/g, '')) || Infinity;
                break;
              case 8:
                greaterThanValue = parseFloat($('#bpcGreaterThan').val().replace(/,/g, '')) || -Infinity;
                lessThanValue = parseFloat($('#bpcLessThan').val().replace(/,/g, '')) || Infinity;
                break;
            }
            return cellValue >= greaterThanValue && cellValue <= lessThanValue;
          }

          clearColumnFilters(column);
          $.fn.dataTable.ext.search.push(filterFunction);

          dataTable.draw();
        });
      };
    };

    container.appendChild(closeButton);
    container.appendChild(table);
    document.body.appendChild(container);
  }

  const existingContainer = document.getElementById('dataTableContainer');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  clickPagesSequentially().then(function(pageData) {
    createDataTableDiv(pageData);
  });

};
