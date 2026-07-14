import React, { useEffect, useMemo, useState, useCallback } from "react";
import axiosClient, { crudApi } from "../../api/axiosClient.js";
import { money } from "../../utils/constants.js";
import { mapApiToUi, mapUiToApi } from "../../utils/mappers.js";
import AppointmentForm from "./AppointmentForm.jsx";
import AppointmentDelete from "./AppointmentDelete.jsx";
import AppointmentDetailModal from "../../components/AppointmentDetailModal.jsx";

const STATUS_CONFIG = {
  PENDING:     { label: "Chờ xử lý",      color: "#b7791f", bg: "#fff4d6", dot: "#f0a500", next: ["CONFIRMED","CANCELLED"] },
  CONFIRMED:   { label: "Đã xác nhận",    color: "#1a73e8", bg: "#e8f1ff", dot: "#1a73e8", next: ["IN_PROGRESS","CANCELLED"] },
  IN_PROGRESS: { label: "Đang thực hiện", color: "#7c3aed", bg: "#f0e7ff", dot: "#7c3aed", next: ["COMPLETED","CANCELLED"] },
  COMPLETED:   { label: "Hoàn thành",     color: "#148a55", bg: "#dcfce7", dot: "#148a55", next: [] },
  CANCELLED:   { label: "Đã hủy",         color: "#d93025", bg: "#ffe7e5", dot: "#d93025", next: [] },
};

const STATUS_RAW = {
  PENDING:"DANG_CHO", CONFIRMED:"DA_XAC_NHAN",
  IN_PROGRESS:"DANG_THUC_HIEN", COMPLETED:"HOAN_THANH", CANCELLED:"DA_HUY"
};

function StatusPill({ status }) {
  const s = STATUS_CONFIG[status] || { label: status, color: "#607087", bg: "#eef2f7", dot: "#999" };
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",gap:5,
      padding:"4px 10px",borderRadius:99,fontSize:12,fontWeight:700,
      color:s.color,background:s.bg
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:s.dot,flexShrink:0}} />
      {s.label}
    </span>
  );
}

/* ─── Calendar View ─────────────────────── */
const DOW = ["T2","T3","T4","T5","T6","T7","CN"];

function CalendarView({ items, onSelect }) {
  const today = new Date();
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());

  const monthLabel = new Date(yr, mo, 1).toLocaleDateString("vi-VN",{month:"long",year:"numeric"});
  const firstDow = (new Date(yr,mo,1).getDay()+6)%7;
  const daysInMo = new Date(yr,mo+1,0).getDate();
  const cells = [...Array(firstDow).fill(null),...Array.from({length:daysInMo},(_,i)=>i+1)];

  const forDay = (d) => {
    if(!d) return [];
    const ds = `${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return items.filter(x=>x.appointmentDate===ds);
  };

  const isToday = (d) => d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();

  const prevMonth = () => { const nd=new Date(yr,mo-1,1); setYr(nd.getFullYear()); setMo(nd.getMonth()); };
  const nextMonth = () => { const nd=new Date(yr,mo+1,1); setYr(nd.getFullYear()); setMo(nd.getMonth()); };

  return (
    <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 4px 20px rgba(0,0,0,.06)",border:"1px solid rgba(232,93,140,.12)"}}>
      {/* Nav */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <h3 style={{margin:0,fontWeight:800,fontSize:18,textTransform:"capitalize"}}>{monthLabel}</h3>
          <button onClick={()=>{setYr(today.getFullYear());setMo(today.getMonth());}} style={{border:"1.5px solid var(--line)",background:"#fff",borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:700,cursor:"pointer",color:"var(--pink)"}}>Hôm nay</button>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[["‹",prevMonth],["›",nextMonth]].map(([ch,fn])=>(
            <button key={ch} onClick={fn} style={{width:34,height:34,border:"1.5px solid var(--line)",background:"#fff",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s ease"}}
              onMouseOver={e=>{e.currentTarget.style.background="var(--pink)";e.currentTarget.style.color="#fff";}}
              onMouseOut={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="inherit";}}>
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Header row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
        {DOW.map(d=>(
          <div key={d} style={{textAlign:"center",padding:"10px 4px",fontWeight:800,fontSize:12,color:"var(--pink)",background:"#fff7fb",borderRadius:8}}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((day,idx)=>{
          const dayItems=forDay(day);
          return (
            <div key={idx} style={{background:day?"#fff":"#fcfafc",borderRadius:10,minHeight:100,padding:"8px 6px",border:"1px solid #f5eef9",position:"relative"}}>
              {day&&(
                <>
                  <span style={{
                    display:"inline-flex",alignItems:"center",justifyContent:"center",
                    width:28,height:28,borderRadius:"50%",fontSize:13,fontWeight:isToday(day)?800:500,
                    background:isToday(day)?"var(--pink)":"transparent",
                    color:isToday(day)?"#fff":"var(--text)",marginBottom:4
                  }}>{day}</span>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {dayItems.slice(0,3).map(item=>{
                      const s=STATUS_CONFIG[item.status]||{bg:"#eef",color:"#555",dot:"#999"};
                      return (
                        <div key={item.id} onClick={()=>onSelect(item)} style={{
                          background:s.bg,color:s.color,borderRadius:6,padding:"2px 6px",
                          fontSize:11,fontWeight:700,cursor:"pointer",overflow:"hidden",
                          textOverflow:"ellipsis",whiteSpace:"nowrap",borderLeft:`3px solid ${s.dot}`,
                          transition:"opacity .15s"
                        }}
                          onMouseOver={e=>e.currentTarget.style.opacity=".75"}
                          onMouseOut={e=>e.currentTarget.style.opacity="1"}
                        >
                          {item.startTime||"—"} · {item.customerName||"KH"}
                        </div>
                      );
                    })}
                    {dayItems.length>3&&<span style={{fontSize:10,color:"var(--muted)",fontWeight:700}}>+{dayItems.length-3} khác</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:14,marginTop:16,flexWrap:"wrap"}}>
        {Object.entries(STATUS_CONFIG).map(([k,s])=>(
          <span key={k} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:s.color}}>
            <span style={{width:10,height:10,borderRadius:3,background:s.bg,border:`2px solid ${s.dot}`}}/>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────── */
export default function AppointmentList({ config }) {
  const [items,setItems] = useState([]);
  const [keyword,setKeyword] = useState("");
  const [statusFilter,setStatusFilter] = useState("all");
  const [dateFilter,setDateFilter] = useState("");
  const [viewMode,setViewMode] = useState("table");
  const [modal,setModal] = useState(false);
  const [editing,setEditing] = useState(null);
  const [deleting,setDeleting] = useState(null);
  const [viewing,setViewing] = useState(null);
  const [loadingStatus,setLoadingStatus] = useState(null);
  const [lookups,setLookups] = useState({customers:[],employees:[],rooms:[],services:[],categories:[]});
  const api = useMemo(()=>crudApi(config.endpoint),[config.endpoint]);

  const [currentPage,setCurrentPage] = useState(1);
  const [itemsPerPage,setItemsPerPage] = useState(10);

  const loadLookups = () => {
    Promise.all(["/customers","/employees","/rooms","/spa-services","/service-categories"].map(ep=>axiosClient.get(ep).catch(()=>[])))
      .then(([cust,emp,rm,svc,cat])=>setLookups({
        customers:Array.isArray(cust)?cust:[],
        employees:Array.isArray(emp)?emp:[],
        rooms:Array.isArray(rm)?rm:[],
        services:Array.isArray(svc)?svc:[],
        categories:Array.isArray(cat)?cat:[]
      }));
  };

  const loadData = useCallback(()=>{
    api.getAll()
      .then(data=>{
        const raw=Array.isArray(data)?data:(data?.content||data?.data||config.mock);
        setItems(raw.map(item=>mapApiToUi(config.endpoint,item)));
      })
      .catch(()=>setItems(config.mock.map(item=>mapApiToUi(config.endpoint,item))));
  },[api,config.endpoint,config.mock]);

  useEffect(()=>{loadData();loadLookups();},[config.endpoint]);

  const stats = useMemo(()=>{
    const c={PENDING:0,CONFIRMED:0,IN_PROGRESS:0,COMPLETED:0,CANCELLED:0};
    items.forEach(x=>{if(c[x.status]!==undefined)c[x.status]++;});
    return c;
  },[items]);

  const filtered = useMemo(()=>items.filter(x=>{
    const kw=!keyword||Object.values(x).some(v=>String(v??"").toLowerCase().includes(keyword.toLowerCase()));
    const st=statusFilter==="all"||x.status===statusFilter;
    const dt=!dateFilter||x.appointmentDate===dateFilter;
    return kw&&st&&dt;
  }),[items,keyword,statusFilter,dateFilter]);

  const totalPages=Math.ceil(filtered.length/itemsPerPage)||1;
  const activePage=Math.min(currentPage,totalPages);
  const idxFirst=(activePage-1)*itemsPerPage;
  const currentItems=filtered.slice(idxFirst,idxFirst+itemsPerPage);

  const pageNums=()=>{
    const max=5,pages=[];
    let start=Math.max(1,activePage-2),end=Math.min(totalPages,start+max-1);
    if(end-start<max-1)start=Math.max(1,end-max+1);
    for(let i=start;i<=end;i++)pages.push(i);
    return pages;
  };

  const todayStr=new Date().toISOString().slice(0,10);

  async function changeStatus(row,newStatus){
    setLoadingStatus(row.id);
    try{
      await axiosClient.put(`/appointments/${row.id}/status`,{status:STATUS_RAW[newStatus]||newStatus});
      loadData();
      if(viewing&&viewing.id===row.id)setViewing(p=>p?{...p,status:newStatus}:null);
    }catch(e){alert("Lỗi cập nhật: "+e.message);}
    finally{setLoadingStatus(null);}
  }

  async function handleDelete(row){
    try{await api.remove(row.id);setItems(items.filter(x=>x.id!==row.id));}
    catch(e){alert("Lỗi xóa: "+e.message);}
    setDeleting(null);
  }

  async function save(form){
    try{
      const payload=mapUiToApi(config.endpoint,form,lookups);
      if(form.id)await api.update(form.id,payload);else await api.create(payload);
      loadData();
    }catch(e){alert("Lỗi lưu: "+e.message);}
    setModal(false);
  }

  const openEditFromDetail=()=>{setEditing(viewing);setViewing(null);setModal(true);};

  const todayCount=items.filter(x=>x.appointmentDate===todayStr).length;

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h1 style={{margin:0,fontSize:28,fontWeight:800}}>📅 Quản lý lịch hẹn</h1>
          <p style={{margin:"6px 0 0",color:"var(--muted)",fontSize:14}}>Xác nhận, theo dõi và cập nhật trạng thái lịch hẹn</p>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",background:"#f5eef9",borderRadius:12,padding:3,gap:2}}>
            {[["table","📋 Bảng"],["calendar","📆 Lịch"]].map(([mode,label])=>(
              <button key={mode} onClick={()=>setViewMode(mode)} style={{
                border:"none",borderRadius:10,padding:"7px 16px",fontWeight:700,fontSize:13,cursor:"pointer",
                background:viewMode===mode?"#fff":"transparent",
                color:viewMode===mode?"var(--pink)":"var(--muted)",
                boxShadow:viewMode===mode?"0 2px 8px rgba(232,93,140,.18)":"none",
                transition:"all .2s ease"
              }}>{label}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={()=>{setEditing(null);setModal(true);}} style={{display:"flex",alignItems:"center",gap:6}}>
            + Thêm lịch hẹn
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {Object.entries(STATUS_CONFIG).map(([key,s])=>(
          <div key={key} onClick={()=>setStatusFilter(statusFilter===key?"all":key)} style={{
            background:statusFilter===key?s.bg:"#fff",
            border:`1.5px solid ${statusFilter===key?s.dot:"rgba(232,93,140,.12)"}`,
            borderRadius:16,padding:"14px 16px",cursor:"pointer",
            transition:"all .2s ease",
            boxShadow:statusFilter===key?`0 4px 16px ${s.dot}30`:"0 2px 8px rgba(0,0,0,.04)"
          }}>
            <div style={{fontSize:24,fontWeight:800,color:s.color}}>{stats[key]}</div>
            <div style={{fontSize:12,fontWeight:700,color:s.color,marginTop:2}}>{s.label}</div>
            {key==="PENDING"&&stats[key]>0&&<div style={{fontSize:10,marginTop:4,color:"#f0a500",fontWeight:700}}>⚠ Cần xử lý ngay</div>}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{background:"#fff",borderRadius:16,padding:"14px 18px",marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.05)",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 220px",position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"var(--muted)"}}>🔍</span>
          <input
            value={keyword}
            onChange={e=>{setKeyword(e.target.value);setCurrentPage(1);}}
            placeholder="Tìm khách hàng, dịch vụ, nhân viên..."
            style={{width:"100%",height:40,border:"1.5px solid var(--line)",borderRadius:12,paddingLeft:36,paddingRight:12,outline:"none",fontSize:14,transition:"border-color .2s"}}
            onFocus={e=>e.target.style.borderColor="var(--pink)"}
            onBlur={e=>e.target.style.borderColor="var(--line)"}
          />
        </div>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setCurrentPage(1);}} style={{height:40,border:"1.5px solid var(--line)",borderRadius:12,padding:"0 12px",outline:"none",background:"#fff",cursor:"pointer",fontWeight:600,color:"#6d5d74",fontSize:14}}>
          <option value="all">📋 Tất cả trạng thái</option>
          {Object.entries(STATUS_CONFIG).map(([k,s])=><option key={k} value={k}>{s.label}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e=>{setDateFilter(e.target.value);setCurrentPage(1);}} style={{height:40,border:"1.5px solid var(--line)",borderRadius:12,padding:"0 12px",outline:"none",fontWeight:600,color:dateFilter?"var(--pink)":"var(--muted)",fontSize:14,cursor:"pointer"}} />
        {(keyword||statusFilter!=="all"||dateFilter)&&(
          <button onClick={()=>{setKeyword("");setStatusFilter("all");setDateFilter("");setCurrentPage(1);}} style={{height:40,border:"1.5px solid #ffe7e5",background:"#fff5f5",borderRadius:12,padding:"0 14px",cursor:"pointer",color:"#d93025",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>
            ✕ Xóa bộ lọc
          </button>
        )}
        <div style={{marginLeft:"auto",fontSize:13,color:"var(--muted)",fontWeight:600}}>
          📅 Hôm nay: <strong style={{color:"var(--pink)"}}>{todayCount}</strong> lịch
        </div>
      </div>

      {/* Calendar */}
      {viewMode==="calendar"&&<CalendarView items={filtered} onSelect={setViewing}/>}

      {/* Table */}
      {viewMode==="table"&&(
        <div style={{background:"#fff",borderRadius:20,boxShadow:"0 4px 20px rgba(0,0,0,.06)",border:"1px solid rgba(232,93,140,.1)",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"linear-gradient(135deg,#fff1f6,#f5eeff)"}}>
                  {["Mã","Khách hàng","Dịch vụ","Nhân viên","Phòng","Ngày","Giờ","Trạng thái & Hành động",""].map((h,i)=>(
                    <th key={i} style={{textAlign:"left",padding:"13px 14px",fontSize:12,fontWeight:800,color:"#5d5064",whiteSpace:"nowrap",borderBottom:"1.5px solid var(--line)"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length===0&&(
                  <tr><td colSpan={9} style={{textAlign:"center",padding:"52px 24px",color:"var(--muted)"}}>
                    <div style={{fontSize:44}}>📭</div>
                    <div style={{marginTop:10,fontWeight:700,fontSize:16}}>Không có lịch hẹn nào</div>
                    <div style={{marginTop:4,fontSize:13}}>Thay đổi bộ lọc hoặc thêm lịch hẹn mới</div>
                  </td></tr>
                )}
                {currentItems.map((row,idx)=>{
                  const sc=STATUS_CONFIG[row.status]||{};
                  const isLoading=loadingStatus===row.id;
                  const isToday=row.appointmentDate===todayStr;
                  return (
                    <tr key={row.id}
                      style={{background:idx%2===1?"#fdfbfe":"#fff",transition:"background .15s"}}
                      onMouseOver={e=>e.currentTarget.style.background="#fff7fc"}
                      onMouseOut={e=>e.currentTarget.style.background=idx%2===1?"#fdfbfe":"#fff"}
                    >
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3",fontWeight:800,color:"var(--pink)",fontSize:13}}>#{row.id}</td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3"}}>
                        <div style={{fontWeight:700,fontSize:14}}>{row.customerName||"—"}</div>
                        {row.customer?.phone&&<div style={{fontSize:11,color:"var(--muted)"}}>{row.customer.phone}</div>}
                      </td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3",fontSize:13,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {row.serviceName||"—"}
                      </td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3",fontSize:13}}>
                        {row.employeeName
                          ?<span style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,var(--pink),var(--purple))",display:"grid",placeItems:"center",color:"#fff",fontSize:11,fontWeight:800,flexShrink:0}}>{row.employeeName.charAt(0)}</span>
                            {row.employeeName}
                          </span>
                          :<span style={{color:"var(--muted)",fontSize:12}}>Chưa phân công</span>
                        }
                      </td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3",fontSize:13}}>{row.roomName||"—"}</td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3",fontSize:13}}>
                        <div style={{fontWeight:600}}>{row.appointmentDate ? row.appointmentDate.split('-').reverse().join('/') : '—'}</div>
                        {isToday && (
                          <span style={{color:"var(--pink)",fontWeight:700,background:"#fff1f6",borderRadius:6,padding:"2px 6px",fontSize:10,display:"inline-block",marginTop:4}}>Hôm nay</span>
                        )}
                      </td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3",fontWeight:700,fontSize:14}}>{row.startTime||"—"}</td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3"}}>
                        <div style={{display:"flex",flexDirection:"column",gap:5}}>
                          <StatusPill status={row.status}/>
                          {!["COMPLETED","CANCELLED"].includes(row.status)&&(
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                              {(STATUS_CONFIG[row.status]?.next||[]).map(ns=>{
                                const s=STATUS_CONFIG[ns];
                                return (
                                  <button key={ns} onClick={()=>changeStatus(row,ns)} disabled={isLoading} style={{
                                    border:`1px solid ${s.dot}`,background:s.bg,color:s.color,
                                    borderRadius:7,padding:"3px 8px",fontWeight:700,fontSize:10,
                                    cursor:isLoading?"not-allowed":"pointer",whiteSpace:"nowrap",
                                    transition:"all .15s",opacity:isLoading?.6:1
                                  }}>→ {s.label}</button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{padding:"12px 14px",borderBottom:"1px solid #faedf3"}}>
                        <div style={{display:"flex",gap:5}}>
                          <button onClick={()=>setViewing(row)} style={{border:"none",background:"#e8f1ff",color:"#1a73e8",borderRadius:8,padding:"6px 10px",fontWeight:700,cursor:"pointer",fontSize:12}}>👁 Xem</button>
                          <button onClick={()=>{setEditing(row);setModal(true);}} style={{border:"none",background:"#fff4d6",color:"#b7791f",borderRadius:8,padding:"6px 10px",fontWeight:700,cursor:"pointer",fontSize:12}}>✏️</button>
                          <button onClick={()=>setDeleting(row)} style={{border:"none",background:"#ffe7e5",color:"#d93025",borderRadius:8,padding:"6px 10px",fontWeight:700,cursor:"pointer",fontSize:12}}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderTop:"1px solid var(--line)",background:"#fdfbfe",borderRadius:"0 0 20px 20px"}}>
            <div style={{fontSize:13,color:"var(--muted)"}}>
              Hiển thị <strong>{filtered.length>0?idxFirst+1:0}</strong>–<strong>{Math.min(idxFirst+itemsPerPage,filtered.length)}</strong> trong <strong>{filtered.length}</strong> lịch hẹn
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} style={{height:34,border:"1px solid var(--line)",borderRadius:8,padding:"0 10px",background:"#fff",fontSize:13,outline:"none",cursor:"pointer"}}>
                {[10,20,50].map(n=><option key={n} value={n}>{n}/trang</option>)}
              </select>
              <button disabled={activePage===1} onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} style={{width:34,height:34,border:"1px solid var(--line)",background:"#fff",borderRadius:8,cursor:activePage===1?"not-allowed":"pointer",fontWeight:700,fontSize:16,opacity:activePage===1?.4:1}}>‹</button>
              {pageNums().map(n=>(
                <button key={n} onClick={()=>setCurrentPage(n)} style={{
                  width:34,height:34,border:"1px solid",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",
                  background:activePage===n?"linear-gradient(135deg,var(--pink),var(--purple))":"#fff",
                  color:activePage===n?"#fff":"var(--text)",
                  borderColor:activePage===n?"transparent":"var(--line)",
                  boxShadow:activePage===n?"0 2px 8px rgba(232,93,140,.3)":"none",
                }}>{n}</button>
              ))}
              <button disabled={activePage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} style={{width:34,height:34,border:"1px solid var(--line)",background:"#fff",borderRadius:8,cursor:activePage===totalPages?"not-allowed":"pointer",fontWeight:700,fontSize:16,opacity:activePage===totalPages?.4:1}}>›</button>
            </div>
          </div>
        </div>
      )}

      {modal&&<AppointmentForm fields={config.fields} initial={editing} onClose={()=>setModal(false)} onSubmit={save} lookups={lookups}/>}
      {deleting&&<AppointmentDelete item={deleting} onConfirm={handleDelete} onCancel={()=>setDeleting(null)}/>}
      {viewing&&<AppointmentDetailModal row={viewing} onClose={()=>setViewing(null)} onUpdateStatus={status=>changeStatus(viewing,status)} onOpenEdit={openEditFromDetail}/>}
    </div>
  );
}
