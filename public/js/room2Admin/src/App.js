import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const localizer = momentLocalizer(moment);

function Room2Admin() {
  const [eventsRoom1, setEventsRoom1] = useState([]);
  const [eventsRoom2, setEventsRoom2] = useState([]);
  const [weekdaySummary, setWeekdaySummary] = useState([]);
  const [popularTimes, setPopularTimes] = useState([]);
  const [equipmentUsage, setEquipmentUsage] = useState({ 'ไมโครโฟน': 0, 'โปเจคเตอร์': 0, 'พอยเตอร์': 0 });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    if (session) {
      getCalendarEventsRoom1().then(fetchedEvents => {
        setEventsRoom1(fetchedEvents);
        summarizeWeekdays(fetchedEvents);
        findTopPopularTimes(fetchedEvents);
        summarizeEquipmentUsage(fetchedEvents);
      });

      getCalendarEventsRoom2().then(fetchedEvents => {
        setEventsRoom2(fetchedEvents);
      });

      fetchOrders();
    }
  }, [session]);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select();
        
      if (error) throw error;
      
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function getCalendarEventsRoom1() {
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/c_c49091981c3b59d31ba1356e5ebe59a1fad27c7c51815737ee3dff56149dce10@group.calendar.google.com/events", {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + session.provider_token,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching events:', errorData);
        throw new Error('ข้อผิดพลาดในการดึงข้อมูลกิจกรรม');
      }
  
      const data = await response.json();
      return data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description || '',
        location: event.location || '',
        attendees: event.attendees || [],
      }));
    } catch (error) {
      console.error('Caught an error:', error);
      throw error;
    }
  }

  async function getCalendarEventsRoom2() {
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/c_c49091981c3b59d31ba1356e5ebe59a1fad27c7c51815737ee3dff56149dce10@group.calendar.google.com/events", {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + session.provider_token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching events from Room 2:', errorData);
        throw new Error('ข้อผิดพลาดในการดึงข้อมูลกิจกรรมจากห้อง 2');
      }

      const data = await response.json();
      return data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description || '',
        location: event.location || '',
        attendees: event.attendees || [],
      }));
    } catch (error) {
      console.error('Caught an error:', error);
      throw error;
    }
  }

  function summarizeWeekdays(events) {
    const weekdayCounts = Array(5).fill(0);

    events.forEach(event => {
      const day = event.start.getDay();
      if (day >= 1 && day <= 5) {
        weekdayCounts[day - 1]++;
      }
    });

    const weekdays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
    const summary = weekdays.map((name, index) => ({
      day: name,
      count: weekdayCounts[index]
    }));

    setWeekdaySummary(summary);
  }

  function findTopPopularTimes(events) {
    const timeSummary = {};

    events.forEach(event => {
      const startHour = event.start.getHours();
      const endHour = event.end.getHours();

      for (let hour = startHour; hour < endHour; hour++) {
        if (!timeSummary[hour]) {
          timeSummary[hour] = 0;
        }
        timeSummary[hour]++;
      }
    });

    const sortedTimes = Object.entries(timeSummary)
      .map(([hour, count]) => ({ time: `${hour}:00 - ${parseInt(hour) + 1}:00`, count }));

    sortedTimes.sort((a, b) => b.count - a.count);

    setPopularTimes(sortedTimes.slice(0, 5));
  }

  function summarizeEquipmentUsage(events) {
    const equipmentUsage = { 'ไมโครโฟน': 0, 'โปเจคเตอร์': 0, 'พอยเตอร์': 0 };

    events.forEach(event => {
      if (event.description) {
        const microphoneMatch = event.description.match(/ไมโครโฟน:\s*(\d+)/);
        const projectorMatch = event.description.match(/โปเจคเตอร์:\s*(\d+)/);
        const pointerMatch = event.description.match(/พอยเตอร์:\s*(\d+)/);

        if (microphoneMatch) {
          equipmentUsage['ไมโครโฟน'] += parseInt(microphoneMatch[1]);
        }
        if (projectorMatch) {
          equipmentUsage['โปเจคเตอร์'] += parseInt(projectorMatch[1]);
        }
        if (pointerMatch) {
          equipmentUsage['พอยเตอร์'] += parseInt(pointerMatch[1]);
        }
      }
    });

    setEquipmentUsage(equipmentUsage);
  }

  const equipmentChartData = {
    labels: Object.keys(equipmentUsage),
    datasets: [
      {
        label: 'การใช้วัสดุอุปกรณ์',
        data: Object.values(equipmentUsage),
        backgroundColor: ['#42a5f5', '#66bb6a', '#ff7043'],
      },
    ],
  };

  const popularTimesChartData = {
    labels: popularTimes.map(item => item.time),
    datasets: [
      {
        label: 'จำนวนการจอง',
        data: popularTimes.map(item => item.count),
        backgroundColor: '#66bb6a',
      },
    ],
  };

  const weekdayChartData = {
    labels: weekdaySummary.map(item => item.day),
    datasets: [
      {
        label: 'จำนวนการจองในแต่ละวัน',
        data: weekdaySummary.map(item => item.count),
        backgroundColor: '#42a5f5',
      },
    ],
  };

  const roomComparisonChartData = {
    labels: ['ห้อง 1', 'ห้อง 2'],
    datasets: [
      {
        label: 'จำนวนการจอง',
        data: [eventsRoom1.length, eventsRoom2.length],
        backgroundColor: '#ff7043',
      },
    ],
  };

  const handleEventSelect = event => {
    alert(`
      Title: ${event.title}
      Description: ${event.description}
      Location: ${event.location}
      Attendees: ${event.attendees.map(attendee => attendee.email).join(", ")}
    `);
  };

  return (
    <div className="App">
      <div className="container mt-5">
        {session ? (
          <>
            <div className="mb-4">
              <h2 className="text-primary text-center">ยินดีต้อนรับ Admin, <span className="text-success">{session.user.email}</span></h2>
            </div>

           {/* 2 Tables on top for Room 1 and Room 2 */}
            <div className="row mb-4">
              <div className="col-md-12"> {/* ใช้ col-md-12 เพื่อให้ปฏิทินขยายเต็มหน้าจอ */}
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-info text-white rounded">ปฏิทินการจองห้องประชุม 1</div>
                  <div className="card-body p-0"> {/* p-0 จะทำให้ไม่มี padding ภายใน เพื่อให้ปฏิทินขยายเต็มที่ */}
                    <BigCalendar
                      localizer={localizer}
                      events={eventsRoom1}
                      onSelectEvent={handleEventSelect}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 'calc(130vh - 250px)', marginTop: '20px' }} 
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* Layout for Equipment Usage and other Charts below */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-success text-white rounded">การใช้วัสดุอุปกรณ์</div>
                  <div className="card-body">
                    <Bar data={equipmentChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-info text-white rounded">เวลาในการจองที่ได้รับความนิยมสูงสุด</div>
                  <div className="card-body">
                    <Bar data={popularTimesChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekday and Room Comparison Charts */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-primary text-white rounded">สรุปจำนวนการจองในแต่ละวัน</div>
                  <div className="card-body">
                    <Bar data={weekdayChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-danger text-white rounded">การเปรียบเทียบจำนวนการจองระหว่างห้อง 1 และห้อง 2</div>
                  <div className="card-body">
                    <Bar data={roomComparisonChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>
            </div>

  
                    
            <div className="text-center mt-4">
              <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => window.location.href = "https://calendar.google.com/calendar/u/0/r?cid=c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com"}>
                  แก้ไขข้อมูลห้องประชุม 1
              </button>
              </div>


              <div className="text-center mt-4">
              <button className="btn btn-danger btn-lg" onClick={signOut}>
                  ออกจากระบบ
                </button>
                </div>
              </>

        ) : (
          <div className="text-center">
            <h3>กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ</h3>
            <button className="btn btn-primary rounded-pill px-4 py-2" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
              เข้าสู่ระบบด้วย Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Room2Admin;
