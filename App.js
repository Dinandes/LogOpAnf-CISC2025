    const correct = st.selected===cur.r;
    const newAnswers = {...st.answers,[st.idx]:st.selected};
    setSt(p=>({...p,confirmed:true,score:correct?p.score+1:p.score,wrong:correct?p.wrong:([...p.wrong.filter(x=>x!==st.idx),st.idx]),answers:newAnswers}));
    setShowDica(false);
  };
  const next = () => {
    if(st.idx<total-1){setSt(p=>({...p,idx:p.idx+1,selected:null,confirmed:false}));setShowDica(false);}
    else{setSt(p=>({...p,done:true}));}
  };
  const prev = () => {
    if(st.hist.length>0){const pidx=st.hist[st.hist.length-1];setSt(p=>({...p,idx:pidx,hist:p.hist.slice(0,-1),selected:p.answers[pidx]||null,confirmed:!!p.answers[pidx]}));setShowDica(false);}
    else if(st.idx>0){setSt(p=>({...p,idx:p.idx-1,selected:p.answers[p.idx-1]||null,confirmed:!!p.answers[p.idx-1]}));setShowDica(false);}
  };
  const redoWrong = () => {
    const wrongQs = qs.filter((_,i)=>st.wrong.includes(i));
    setQs(wrongQs);setSt({idx:0,selected:null,confirmed:false,score:0,wrong:[],hist:[],done:false,answers:{}});setShowDica(false);
  };
  const restart = () => {setQs(MC);setSt({idx:0,selected:null,confirmed:false,score:0,wrong:[],hist:[],done:false,answers:{}});setShowDica(false);};

  if(st.done){
    const pct=Math.round((st.score/total)*100);
    return (
      <div className="result-screen">
        <div className="score-big">{pct}%</div>
        <div style={{fontSize:18,margin:"10px 0"}}>{st.score}/{total} corretas</div>
        <div style={{color:"var(--tx2)",marginBottom:20}}>{pct>=80?"🏆 Excelente!":pct>=60?"👍 Bom!":"📚 Continue estudando!"}</div>
        {st.wrong.length>0&&<button className="btn btn-red" style={{marginRight:8}} onClick={redoWrong}>🔁 Refazer {st.wrong.length} erradas</button>}
        <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
      </div>
    );
  }
  if(!cur) return null;
  return (
    <div>
      <div className="counter">Questão {st.idx+1}/{total} · ✓ {st.score} · ✗ {st.wrong.length}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((st.idx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
          <span className="question-num">{st.idx+1}</span>
          <div className="q-text">{cur.p}</div>
        </div>
        {cur.a.map(a=>{
          let cls="alt-btn";
          if(st.confirmed){
            if(a.l===cur.r)cls+=" correct";
            else if(a.l===st.selected&&a.l!==cur.r)cls+=" wrong";
          }else if(a.l===st.selected)cls+=" selected";
          return (
            <button key={a.l} className={cls} onClick={()=>select(a.l)} disabled={st.confirmed}>
              <span className="alt-letter">{a.l}</span>{a.t}
            </button>
          );
        })}
        {st.confirmed&&(
          <>
            <div className={`tip-box`} style={{marginTop:8}}>
              {st.selected===cur.r?"✅ Correto!":"❌ Errado! Resposta: "+cur.r}
            </div>
            <div className="mem-box">🧠 {cur.dm}</div>
          </>
        )}
        {!st.confirmed&&(
          <div>
            <button className="btn btn-outline btn-sm" style={{marginTop:6}} onClick={()=>setShowDica(p=>!p)}>💡 Dica</button>
            {showDica&&<div className="tip-box">💡 {cur.d}</div>}
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={st.idx===0&&st.hist.length===0}>◀ Anterior</button>
        {!st.confirmed?<button className="btn btn-gold" onClick={confirm} disabled={!st.selected}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{st.idx<total-1?"Próxima ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: CERTO OU ERRADO
// ================================================================
function CertoErrado() {
  const [st,setSt] = useState({idx:0,selected:null,justif:"",confirmed:false,wrong:[],hist:[],done:false,answers:{},justifs:{}});
  const [showDica,setShowDica] = useState(false);
  const [qs,setQs] = useState(CE);
  const cur = qs[st.idx];
  const total = qs.length;

  const confirm = () => {
    if(!st.selected)return;
    const correct = st.selected===cur.r;
    const needsJustif = st.selected==="errado" && !st.justif.trim();
    if(needsJustif){alert("Por favor, justifique por que você marcou como ERRADO.");return;}
    setSt(p=>({...p,confirmed:true,wrong:correct?p.wrong:([...p.wrong.filter(x=>x!==p.idx),p.idx]),answers:{...p.answers,[p.idx]:p.selected},justifs:{...p.justifs,[p.idx]:p.justif}}));
    setShowDica(false);
  };
  const next = () => {
    if(st.idx<total-1)setSt(p=>({...p,idx:p.idx+1,selected:null,justif:"",confirmed:false}));
    else setSt(p=>({...p,done:true}));
    setShowDica(false);
  };
  const prev = () => {
    if(st.idx>0)setSt(p=>({...p,idx:p.idx-1,selected:p.answers[p.idx-1]||null,justif:p.justifs[p.idx-1]||"",confirmed:!!p.answers[p.idx-1]}));
    setShowDica(false);
  };
  const redoWrong = () => {
    const wqs=CE.filter((_,i)=>st.wrong.includes(i));
    setQs(wqs);setSt({idx:0,selected:null,justif:"",confirmed:false,wrong:[],hist:[],done:false,answers:{},justifs:{}});
  };
  const restart = () => {setQs(CE);setSt({idx:0,selected:null,justif:"",confirmed:false,wrong:[],hist:[],done:false,answers:{},justifs:{}});};

  if(st.done){
    const score = CE.length-st.wrong.length;
    const pct=Math.round((score/total)*100);
    return (
      <div className="result-screen">
        <div className="score-big">{pct}%</div>
        <div style={{fontSize:18,margin:"10px 0"}}>{score}/{total} corretas</div>
        {st.wrong.length>0&&<button className="btn btn-red" style={{marginRight:8}} onClick={redoWrong}>🔁 Refazer {st.wrong.length} erradas</button>}
        <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
      </div>
    );
  }
  if(!cur) return null;
  return (
    <div>
      <div className="counter">Questão {st.idx+1}/{total}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((st.idx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
          <span className="question-num">{st.idx+1}</span>
          <div className="q-text">"{cur.a}"</div>
        </div>
        <div className="btn-row" style={{marginBottom:10}}>
          {["certo","errado"].map(op=>{
            let cls="btn";
            if(st.confirmed){cls+=op===cur.r?" btn-green":(st.selected===op?" btn-red":" btn-outline");}
            else{cls+=st.selected===op?" btn-gold":" btn-outline";}
            return <button key={op} className={cls} onClick={()=>!st.confirmed&&setSt(p=>({...p,selected:op}))} disabled={st.confirmed}>
              {op==="certo"?"✅ CERTO":"❌ ERRADO"}
            </button>;
          })}
        </div>
        {(st.selected==="errado"||st.confirmed&&cur.r==="errado")&&(
          <div style={{marginBottom:10}}>
            <label style={{fontSize:12,color:"var(--tx2)",display:"block",marginBottom:4}}>
              {st.confirmed?"Sua justificativa:":"Justifique por que está ERRADO:"}
            </label>
            <textarea value={st.justif} onChange={e=>!st.confirmed&&setSt(p=>({...p,justif:e.target.value}))} readOnly={st.confirmed} rows={3} placeholder="Explique o erro..."/>
          </div>
        )}
        {st.confirmed&&(
          <>
            <div className="gabarito-box">
              {st.selected===cur.r?"✅ Acertou!":"❌ Errou!"}<br/>
              <strong>Resposta correta: {cur.r.toUpperCase()}</strong><br/>
              {cur.j}
            </div>
            <div className="mem-box">🧠 {cur.dm}</div>
          </>
        )}
        {!st.confirmed&&(
          <div>
            <button className="btn btn-outline btn-sm" onClick={()=>setShowDica(p=>!p)}>💡 Dica</button>
            {showDica&&<div className="tip-box">💡 {cur.d}</div>}
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={st.idx===0}>◀ Anterior</button>
        {!st.confirmed?<button className="btn btn-gold" onClick={confirm} disabled={!st.selected}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{st.idx<total-1?"Próxima ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: COMPLETE AS LACUNAS
// ================================================================
function CompleteLacunas() {
  const [idx,setIdx] = useState(0);
  const [resps,setResps] = useState({});
  const [confirmed,setConfirmed] = useState({});
  const [wrong,setWrong] = useState([]);
  const [showDica,setShowDica] = useState(false);
  const [done,setDone] = useState(false);
  const [hist,setHist] = useState([]);
  const qs = GAP;
  const cur = qs[idx];
  const total = qs.length;

  const getCurResp = () => resps[idx]||cur.res.map(()=>"");
  const setResp = (ri,v) => {
    const arr=[...getCurResp()];arr[ri]=v;
    setResps(p=>({...p,[idx]:arr}));
  };
  const confirm = () => {
    if(confirmed[idx])return;
    const arr=getCurResp();
    const allFilled=arr.every(r=>r.trim().length>0);
    if(!allFilled){alert("Preencha todas as lacunas antes de confirmar.");return;}
    const correct=cur.res.every((r,i)=>arr[i].trim().toLowerCase().includes(r.toLowerCase().split("(")[0].trim().toLowerCase()));
    if(!correct)setWrong(w=>[...w.filter(x=>x!==idx),idx]);
    setConfirmed(p=>({...p,[idx]:true}));
    setShowDica(false);
  };
  const next = () => {
    if(idx<total-1){setHist(h=>[...h,idx]);setIdx(i=>i+1);setShowDica(false);}
    else setDone(true);
  };
  const prev = () => {
    if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setIdx(p);}
    else if(idx>0){setIdx(i=>i-1);}
    setShowDica(false);
  };
  const restart = () => {setIdx(0);setResps({});setConfirmed({});setWrong([]);setDone(false);setHist([]);};

  if(done||idx>=total){
    const score=total-wrong.length;
    return (
      <div className="result-screen">
        <div className="score-big">{Math.round((score/total)*100)}%</div>
        <div style={{fontSize:18,margin:"10px 0"}}>{score}/{total} corretas</div>
        <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
      </div>
    );
  }
  if(!cur)return null;
  const arr=getCurResp();
  let parts=cur.frase.split("________");

  return (
    <div>
      <div className="counter">Questão {idx+1}/{total}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((idx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"flex-start"}}>
          <span className="question-num">{idx+1}</span>
          <div className="q-text">Complete as lacunas:</div>
        </div>
        <div style={{fontSize:14,lineHeight:2,color:"var(--tx)"}}>
          {parts.map((part,i)=>(
            <span key={i}>
              {part}
              {i<parts.length-1&&(
                <input type="text" style={{display:"inline-block",width:180,margin:"0 4px",verticalAlign:"middle"}}
                  value={arr[i]||""}
                  onChange={e=>!confirmed[idx]&&setResp(i,e.target.value)}
                  readOnly={!!confirmed[idx]}
                  placeholder={`Lacuna ${i+1}`}/>
              )}
            </span>
          ))}
        </div>
        {confirmed[idx]&&(
          <>
            <div className="gabarito-box" style={{marginTop:10,whiteSpace:"pre-line"}}>
              ✅ Gabarito:\n{cur.res.map((r,i)=>`Lacuna ${i+1}: ${r}`).join("\n")}
            </div>
            <div className="mem-box">🧠 {cur.dm}</div>
          </>
        )}
        {!confirmed[idx]&&(
          <div style={{marginTop:8}}>
            <button className="btn btn-outline btn-sm" onClick={()=>setShowDica(p=>!p)}>💡 Dica</button>
            {showDica&&<div className="tip-box">💡 {cur.d}</div>}
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={idx===0&&hist.length===0}>◀ Anterior</button>
        {!confirmed[idx]?<button className="btn btn-gold" onClick={confirm}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{idx<total-1?"Próxima ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: DEFINIÇÕES
// ================================================================
function Definicoes() {
  const [idx,setIdx] = useState(0);
  const [resp,setResp] = useState({});
  const [confirmed,setConfirmed] = useState({});
  const [wrong,setWrong] = useState([]);
  const [showDica,setShowDica] = useState(false);
  const [done,setDone] = useState(false);
  const [hist,setHist] = useState([]);
  const qs = DEF;
  const cur = qs[idx];
  const total = qs.length;

  const confirm = () => {
    if(confirmed[idx])return;
    if(!resp[idx]?.trim()){alert("Escreva uma definição antes de confirmar.");return;}
    setConfirmed(p=>({...p,[idx]:true}));
    setShowDica(false);
  };
  const next = () => {
    if(idx<total-1){setHist(h=>[...h,idx]);setIdx(i=>i+1);setShowDica(false);}
    else setDone(true);
  };
  const prev = () => {
    if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setIdx(p);}
    else if(idx>0)setIdx(i=>i-1);
    setShowDica(false);
  };
  const restart = () => {setIdx(0);setResp({});setConfirmed({});setWrong([]);setDone(false);setHist([]);};

  if(done){
    return (
      <div className="result-screen">
        <div className="score-big">✅</div>
        <div style={{fontSize:18,margin:"10px 0"}}>Todas as definições respondidas!</div>
        <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
      </div>
    );
  }
  if(!cur)return null;
  return (
    <div>
      <div className="counter">Questão {idx+1}/{total}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((idx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"flex-start"}}>
          <span className="question-num">{idx+1}</span>
          <div className="q-text">Defina o termo: <strong style={{color:"var(--gd)"}}>{cur.t}</strong></div>
        </div>
        <textarea value={resp[idx]||""} onChange={e=>!confirmed[idx]&&setResp(p=>({...p,[idx]:e.target.value}))}
          readOnly={!!confirmed[idx]} rows={4} placeholder="Escreva sua definição aqui..."/>
        {confirmed[idx]&&(
          <>
            <div className="gabarito-box" style={{marginTop:10}}><strong>📋 Gabarito:</strong><br/>{cur.def}</div>
            <div className="gabarito-resumido"><strong>📌 Gabarito Resumido:</strong> {cur.gr}</div>
            <div className="mem-box">🧠 {cur.dm}</div>
          </>
        )}
        {!confirmed[idx]&&(
          <div style={{marginTop:8}}>
            <button className="btn btn-outline btn-sm" onClick={()=>setShowDica(p=>!p)}>💡 Dica</button>
            {showDica&&<div className="tip-box">💡 {cur.d}</div>}
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={idx===0&&hist.length===0}>◀ Anterior</button>
        {!confirmed[idx]?<button className="btn btn-gold" onClick={confirm}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{idx<total-1?"Próxima ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: CORRELACIONE
// ================================================================
function Correlacione() {
  const [setIdx,setSetIdx] = useState(0);
  const [sel,setSel] = useState(null); // selected left item number
  const [matches,setMatches] = useState({}); // {left_num: right_idx}
  const [confirmed,setConfirmed] = useState(false);
  const [showDica,setShowDica] = useState(false);
  const [done,setDone] = useState(false);
  const [hist,setHist] = useState([]);
  const [shuffledRight,setShuffledRight] = useState(null);

  const curSet = COR[setIdx];
  const total = COR.length;

  const rightItems = shuffledRight || curSet.items;
  const initRight = () => setShuffledRight(shuffle(curSet.items));

  useEffect(()=>{initRight();},[setIdx]);

  const selectLeft = (n) => {
    if(confirmed)return;
    setSel(prev=>prev===n?null:n);
  };
  const selectRight = (rightIdx) => {
    if(confirmed||sel===null)return;
    // sel = left num, rightIdx = index in shuffled right
    // Find right item num
    const rightItem = rightItems[rightIdx];
    setMatches(prev=>({...prev,[sel]:rightIdx}));
    setSel(null);
  };
  const confirm = () => {
    if(Object.keys(matches).length<curSet.items.filter(it=>it.n>0).length)return;
    setConfirmed(true);setShowDica(false);
  };
  const next = () => {
    if(setIdx<total-1){
      setHist(h=>[...h,setIdx]);setSetIdx(i=>i+1);
      setMatches({});setSel(null);setConfirmed(false);setShuffledRight(null);setShowDica(false);
    }else setDone(true);
  };
  const prev = () => {
    if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setSetIdx(p);setMatches({});setSel(null);setConfirmed(false);setShuffledRight(null);}
    else if(setIdx>0){setSetIdx(i=>i-1);setMatches({});setSel(null);setConfirmed(false);setShuffledRight(null);}
    setShowDica(false);
  };
  const restart = () => {setSetIdx(0);setMatches({});setSel(null);setConfirmed(false);setDone(false);setHist([]);setShuffledRight(null);};

  if(done){return(
    <div className="result-screen">
      <div className="score-big">✅</div>
      <div style={{fontSize:18,margin:"10px 0"}}>Todos os conjuntos completados!</div>
      <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
    </div>
  );}

  if(!rightItems)return null;
  const leftItems = curSet.items.filter(it=>it.n>0);

  const getMatchResult = (leftNum) => {
    const rightIdx = matches[leftNum];
    if(rightIdx===undefined)return null;
    const rightItem = rightItems[rightIdx];
    // Check if correct
    const correctRightNum = curSet.gabarito[leftNum];
    return rightItem.n===correctRightNum?"correct":"wrong";
  };

  return (
    <div>
      <div className="counter">Conjunto {setIdx+1}/{total}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((setIdx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div className="q-text">Correlacione: <strong style={{color:"var(--gd)"}}>{curSet.titulo}</strong></div>
        <div style={{fontSize:12,color:"var(--tx2)",marginBottom:12}}>
          {sel!==null?`✋ Item ${sel} selecionado — clique em uma resposta na coluna direita`:"Clique em um item da coluna ESQUERDA para selecionar, depois clique na resposta correta"}
        </div>
        <div style={{fontSize:12,color:"var(--or)",marginBottom:8}}>⚠️ Atenção: um item na direita é FALSO (marcado com "—")</div>
        <div className="corr-grid">
          <div>
            <div style={{fontSize:11,color:"var(--tx2)",marginBottom:6,fontWeight:700}}>◀ COLUNA A (Termos)</div>
            {leftItems.map((item)=>{
              const res = confirmed?getMatchResult(item.n):null;
              let cls="corr-left-item";
              if(sel===item.n)cls+=" selected";
              else if(res==="correct")cls+=" matched";
              else if(res==="wrong")cls+=" wrong-match";
              const matchedRightIdx = matches[item.n];
              const matchedRight = matchedRightIdx!==undefined?rightItems[matchedRightIdx]:null;
              return (
                <div key={item.n} className={cls} onClick={()=>selectLeft(item.n)}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className="corr-num">{item.n}</span>
                    <span style={{flex:1}}>{item.esq}</span>
                    {matchedRight&&<span style={{color:"var(--gd)",fontSize:11}}>→ {matchedRight.n===0?"—":matchedRight.n}</span>}
                    {res&&<span>{res==="correct"?"✅":"❌"}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <div style={{fontSize:11,color:"var(--tx2)",marginBottom:6,fontWeight:700}}>COLUNA B (Definições) ▶</div>
            {rightItems.map((item,ri)=>{
              const isMatched = Object.values(matches).includes(ri);
              let cls="corr-right-item";
              if(confirmed){
                // check correctness
                const leftNum=Object.keys(matches).find(k=>matches[k]===ri);
                if(leftNum){
                  const correct=curSet.gabarito[leftNum]===item.n;
                  cls+=correct?" matched":" wrong-match";
                }
              }else if(isMatched)cls+=" matched";
              return (
                <div key={ri} className={cls} onClick={()=>selectRight(ri)}>
                  {item.n===0?<span style={{color:"var(--rd)"}}>— (FALSO)</span>:<span><strong style={{color:"var(--gd)"}}>[{item.n}]</strong> {item.dir}</span>}
                </div>
              );
            })}
          </div>
        </div>
        {confirmed&&(
          <>
            <div className="gabarito-box" style={{marginTop:10}}>
              ✅ Gabarito: {leftItems.map(it=>`${it.n}→${curSet.gabarito[it.n]}`).join(", ")}
            </div>
            <div className="mem-box">🧠 {curSet.dm}</div>
          </>
        )}
        {!confirmed&&(
          <div style={{marginTop:8}}>
            <button className="btn btn-outline btn-sm" onClick={()=>setShowDica(p=>!p)}>💡 Dica</button>
            {showDica&&<div className="tip-box">💡 {curSet.d}</div>}
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={setIdx===0&&hist.length===0}>◀ Anterior</button>
        {!confirmed?<button className="btn btn-gold" onClick={confirm}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{setIdx<total-1?"Próximo ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: CITE / LISTE (genérico)
// ================================================================
function CiteListe({qs,titulo}) {
  const [idx,setIdx] = useState(0);
  const [resp,setResp] = useState({});
  const [confirmed,setConfirmed] = useState({});
  const [wrong,setWrong] = useState([]);
  const [showDica,setShowDica] = useState(false);
  const [done,setDone] = useState(false);
  const [hist,setHist] = useState([]);
  const cur = qs[idx];
  const total = qs.length;

  const confirm = () => {
    if(confirmed[idx])return;
    if(!resp[idx]?.trim()){alert("Escreva sua resposta antes de confirmar.");return;}
    setConfirmed(p=>({...p,[idx]:true}));
    setShowDica(false);
  };
  const next = () => {
    if(idx<total-1){setHist(h=>[...h,idx]);setIdx(i=>i+1);setShowDica(false);}
    else setDone(true);
  };
  const prev = () => {
    if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setIdx(p);}
    else if(idx>0)setIdx(i=>i-1);
    setShowDica(false);
  };
  const restart = () => {setIdx(0);setResp({});setConfirmed({});setWrong([]);setDone(false);setHist([]);};

  if(done){
    return (
      <div className="result-screen">
        <div className="score-big">✅</div>
        <div style={{fontSize:18,margin:"10px 0"}}>Concluído!</div>
        <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
      </div>
    );
  }
  if(!cur)return null;
  return (
    <div>
      <div className="counter">Questão {idx+1}/{total}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((idx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"flex-start"}}>
          <span className="question-num">{idx+1}</span>
          <div className="q-text">{cur.p}</div>
        </div>
        <textarea value={resp[idx]||""} onChange={e=>!confirmed[idx]&&setResp(p=>({...p,[idx]:e.target.value}))}
          readOnly={!!confirmed[idx]} rows={5} placeholder="Escreva sua resposta..."/>
        {confirmed[idx]&&(
          <>
            <div className="gabarito-box" style={{marginTop:10}}>
              <strong>📋 Gabarito:</strong>
              <ul style={{marginTop:6}}>
                {cur.itens.map((item,i)=><li key={i} style={{color:"var(--bl)"}}>{item}</li>)}
              </ul>
            </div>
            <div className="gabarito-resumido"><strong>📌 Resumido:</strong> {cur.gr}</div>
            <div className="mem-box">🧠 {cur.dm}</div>
          </>
        )}
        {!confirmed[idx]&&(
          <div style={{marginTop:8}}>
            <button className="btn btn-outline btn-sm" onClick={()=>setShowDica(p=>!p)}>💡 Dica</button>
            {showDica&&<div className="tip-box">💡 {cur.d}</div>}
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={idx===0&&hist.length===0}>◀ Anterior</button>
        {!confirmed[idx]?<button className="btn btn-gold" onClick={confirm}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{idx<total-1?"Próxima ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: V ou F
// ================================================================
function VouF() {
  const [setIdx,setSetIdx] = useState(0);
  const [resps,setResps] = useState({});
  const [confirmed,setConfirmed] = useState(false);
  const [showDicas,setShowDicas] = useState({});
  const [done,setDone] = useState(false);
  const [wrong,setWrong] = useState([]);
  const [hist,setHist] = useState([]);
  const curSet = VF[setIdx];
  const total = VF.length;

  const setResp = (id,v) => !confirmed&&setResps(p=>({...p,[id]:v}));
  const confirm = () => {
    if(Object.keys(resps).length<curSet.itens.length){alert("Marque todos os itens antes de confirmar.");return;}
    const newWrong=curSet.itens.filter(it=>resps[it.id]!==it.r).map(it=>it.id);
    setWrong(newWrong);setConfirmed(true);
  };
  const next = () => {
    if(setIdx<total-1){setHist(h=>[...h,setIdx]);setSetIdx(i=>i+1);setResps({});setConfirmed(false);setShowDicas({});setWrong([]);}
    else setDone(true);
  };
  const prev = () => {
    if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setSetIdx(p);setResps({});setConfirmed(false);setShowDicas({});setWrong([]);}
    else if(setIdx>0){setSetIdx(i=>i-1);setResps({});setConfirmed(false);setShowDicas({});setWrong([]);}
  };
  const restart = () => {setSetIdx(0);setResps({});setConfirmed(false);setDone(false);setHist([]);setWrong([]);setShowDicas({});};

  if(done){return(
    <div className="result-screen">
      <div className="score-big">✅</div>
      <div style={{fontSize:18,margin:"10px 0"}}>Todos os conjuntos V/F completados!</div>
      <button className="btn btn-gold" onClick={restart}>🔄 Recomeçar</button>
    </div>
  );}

  return (
    <div>
      <div className="counter">Conjunto {setIdx+1}/{total}</div>
      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${((setIdx+1)/total)*100}%`}}/></div>
      <div className="q-block">
        <div className="q-text">Verdadeiro (V) ou Falso (F): <strong style={{color:"var(--gd)"}}>{curSet.titulo}</strong></div>
        {curSet.itens.map((item,i)=>{
          const resp=resps[item.id];
          const isCorrect=confirmed&&resp===item.r;
          const isWrong=confirmed&&resp!==item.r;
          return (
            <div key={item.id} style={{marginBottom:12,padding:10,background:"var(--bg3)",borderRadius:8,border:`1px solid ${confirmed?(isCorrect?"var(--gn)":isWrong?"var(--rd)":"var(--bd)"):"var(--bd)"}`}}>
              <div style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:8}}>
                <span className="question-num" style={{fontSize:11,width:24,height:24}}>{String.fromCharCode(65+i)}</span>
                <span style={{fontSize:13,lineHeight:1.5}}>{item.afirm}</span>
              </div>
              <div style={{display:"flex",gap:6}}>
                {["V","F"].map(op=>{
                  let cls="btn btn-sm";
                  if(confirmed){
                    if(op===item.r)cls+=" btn-green";
                    else if(resp===op&&op!==item.r)cls+=" btn-red";
                    else cls+=" btn-outline";
                  }else cls+=resp===op?" btn-gold":" btn-outline";
                  return <button key={op} className={cls} onClick={()=>setResp(item.id,op)} disabled={confirmed}>{op}</button>;
                })}
                <button className="btn btn-outline btn-sm" onClick={()=>setShowDicas(p=>({...p,[item.id]:!p[item.id]}))}>💡</button>
                {confirmed&&<span>{isCorrect?"✅":"❌"}</span>}
              </div>
              {showDicas[item.id]&&<div className="tip-box" style={{marginTop:6}}>💡 {item.d}</div>}
              {confirmed&&<div className="mem-box" style={{marginTop:6}}>🧠 {item.dm}</div>}
            </div>
          );
        })}
        {confirmed&&wrong.length>0&&<div className="gabarito-box">❌ Errou: {wrong.join(", ")}</div>}
      </div>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={prev} disabled={setIdx===0&&hist.length===0}>◀ Anterior</button>
        {!confirmed?<button className="btn btn-gold" onClick={confirm}>✔ Confirmar</button>
          :<button className="btn btn-blue" onClick={next}>{setIdx<total-1?"Próximo ▶":"Ver Resultado"}</button>}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: COMPLETE (dado o termo, complete)
// ================================================================
function Complete() {
  return <CiteListe qs={COMP} titulo="Complete"/>;
}

// ================================================================
// COMPONENTE: MENU DE EXERCÍCIOS
// ================================================================
function MenuExercicios({setExer}) {
  const tipos=[
    {id:"mc",icon:"🔢",name:"Múltipla Escolha",count:`${MC.length} questões`},
    {id:"ce",icon:"✅",name:"Certo ou Errado",count:`${CE.length} questões`},
    {id:"gap",icon:"📝",name:"Complete Lacunas",count:`${GAP.length} questões`},
    {id:"def",icon:"📖",name:"Definições",count:`${DEF.length} questões`},
    {id:"cor",icon:"🔗",name:"Correlacione",count:`${COR.length} conjuntos`},
    {id:"cite",icon:"💬",name:"Cite",count:`${CITE.length} questões`},
    {id:"liste",icon:"📋",name:"Liste",count:`${LIST.length} questões`},
    {id:"vf",icon:"🔠",name:"V ou F",count:`${VF.length} conjuntos`},
    {id:"comp",icon:"✍️",name:"Complete",count:`${COMP.length} questões`},
  ];
  return (
    <div>
      <div className="tip-box">💡 Escolha um tipo de exercício abaixo. O progresso é salvo automaticamente.</div>
      <div className="exer-menu-grid">
        {tipos.map(t=>(
          <div key={t.id} className="exer-menu-btn" onClick={()=>setExer(t.id)}>
            <div className="icon">{t.icon}</div>
            <div className="name">{t.name}</div>
            <div className="count">{t.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: EXERCÍCIOS (roteador)
// ================================================================
function Exercicios() {
  const [exer,setExer] = useState(LS.get("last_exer",null));
  useEffect(()=>{if(exer)LS.set("last_exer",exer);},[exer]);
  const nomes={mc:"Múltipla Escolha",ce:"Certo ou Errado",gap:"Complete Lacunas",def:"Definições",cor:"Correlacione",cite:"Cite",liste:"Liste",vf:"V ou F",comp:"Complete"};
  return (
    <div className="page">
      <h2>🎯 Exercícios</h2>
      {exer&&(
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <button className="btn btn-outline btn-sm" onClick={()=>setExer(null)}>← Menu</button>
          <span style={{color:"var(--gd)",fontWeight:700}}>{nomes[exer]}</span>
        </div>
      )}
      {!exer&&<MenuExercicios setExer={setExer}/>}
      {exer==="mc"&&<MultiplaEscolha/>}
      {exer==="ce"&&<CertoErrado/>}
      {exer==="gap"&&<CompleteLacunas/>}
      {exer==="def"&&<Definicoes/>}
      {exer==="cor"&&<Correlacione/>}
      {exer==="cite"&&<CiteListe qs={CITE} titulo="Cite"/>}
      {exer==="liste"&&<CiteListe qs={LIST} titulo="Liste"/>}
      {exer==="vf"&&<VouF/>}
      {exer==="comp"&&<Complete/>}
    </div>
  );
}

// ================================================================
// APP PRINCIPAL
// ================================================================
export default function App() {
  const [tab,setTab] = useState("inicio");
  return (
    <div className="app">
      <style>{G}</style>
      <TopBar tab={tab} setTab={setTab}/>
      {tab==="inicio"&&<Home setTab={setTab}/>}
      {tab==="superresumo"&&<SuperResumo/>}
      {tab==="resumo"&&<ResumoCompleto/>}
      {tab==="mapa"&&<MapaMental/>}
      {tab==="flashcards"&&<Flashcards/>}
      {tab==="consulta"&&<Consulta/>}
      {tab==="qpadrao"&&<QuestoesPadroes/>}
      {tab==="exercicios"&&<Exercicios/>}
    </div>
  );
}
