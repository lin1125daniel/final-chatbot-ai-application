/* Minimal dashboard frontend: injects mock data and renders
   the UI components defined in index.html and styled in styles.css.
 */

const balanceEl = document.getElementById("balance-amount");
const balanceChangeEl = document.getElementById("balance-change");
const cardsEl = document.getElementById("cards");
const txListEl = document.getElementById("tx-list");
const btnRefresh = document.getElementById("btn-refresh");

function formatMoney(n){
  return `$${n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
}

const MOCK = {
  balance: 12842.75,
  change: 2.7,
  portfolio: [
    {label:'BTC', value: 6420.12, change: 3.4, data:[1,2,3,4,3,4,6]},
    {label:'ETH', value: 3280.50, change: -1.2, data:[3,2,4,5,4,3,2]},
    {label:'USDT', value: 3142.13, change: 0.1, data:[2,2,2,2,2,2,2]}
  ],
  transactions: [
    {name:'Starbucks', meta:'Cafe • Today', amount:-5.75},
    {name:'Salary', meta:'Payroll • Yesterday', amount:2500.00},
    {name:'Electric', meta:'Utilities • Apr 20', amount:-68.34}
  ]
};

function render(){
  balanceEl.textContent = formatMoney(MOCK.balance);
  balanceChangeEl.textContent = `${MOCK.change>0?'+':''}${MOCK.change}%`;

  // Cards
  cardsEl.innerHTML = '';
  MOCK.portfolio.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="label">${p.label}</div>
                      <div class="value">${formatMoney(p.value)}</div>
                      <div class="spark">${sparklineSvg(p.data)}</div>`;
    cardsEl.appendChild(card);
  });

  // Transactions
  txListEl.innerHTML = '';
  MOCK.transactions.forEach(t => {
    const el = document.createElement('div');
    el.className = 'transaction';
    const left = document.createElement('div'); left.className='tx-left';
    left.innerHTML = `<div class='tx-name'>${t.name}</div><div class='tx-meta'>${t.meta}</div>`;
    const amount = document.createElement('div'); amount.className='tx-amount';
    amount.textContent = `${t.amount<0?'-':''}${formatMoney(Math.abs(t.amount))}`;
    el.appendChild(left); el.appendChild(amount);
    txListEl.appendChild(el);
  });
}

function sparklineSvg(data){
  const w=140,h=36,p=4;
  const max=Math.max(...data), min=Math.min(...data);
  const pts = data.map((v,i)=>{
    const x = p + (i*(w-2*p)/(data.length-1));
    const y = p + ((max-v)/(max-min||1))*(h-2*p);
    return `${x},${y}`;
  }).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <polyline points="${pts}" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
  </svg>`;
}

btnRefresh?.addEventListener('click', ()=>{ // simple refresh animation
  btnRefresh.animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:600});
  // simulate data update
  MOCK.balance += Math.round((Math.random()-0.4)*200);
  MOCK.change = (Math.random()*4-1).toFixed(2);
  render();
});

render();

