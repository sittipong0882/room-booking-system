import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Modal, Button } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const localizer = momentLocalizer(moment);

function Room1Admin() {
  const [eventsRoom1, setEventsRoom1] = useState([]);
  const [eventsRoom2, setEventsRoom2] = useState([]);
  const [weekdaySummaryRoom1, setWeekdaySummaryRoom1] = useState([]);
  const [weekdaySummaryRoom2, setWeekdaySummaryRoom2] = useState([]);
  const [popularTimesRoom1, setPopularTimesRoom1] = useState([]);
  const [popularTimesRoom2, setPopularTimesRoom2] = useState([]);
  const [equipmentUsageRoom1, setEquipmentUsageRoom1] = useState({ 'ไมโครโฟน': 0, 'โปรเจคเตอร์': 0, 'พอยเตอร์': 0 });
  const [equipmentUsageRoom2, setEquipmentUsageRoom2] = useState({ 'ไมโครโฟน': 0, 'โปรเจคเตอร์': 0, 'พอยเตอร์': 0 });
  const [totalBookingsRoom1, setTotalBookingsRoom1] = useState(0);
  const [totalBookingsRoom2, setTotalBookingsRoom2] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    if (session) {
      getCalendarEventsRoom1().then(fetchedEvents => {
        setEventsRoom1(fetchedEvents);
        setTotalBookingsRoom1(fetchedEvents.length);
        summarizeWeekdays(fetchedEvents, setWeekdaySummaryRoom1);
        findTopPopularTimes(fetchedEvents, setPopularTimesRoom1);
        summarizeEquipmentUsage(fetchedEvents, setEquipmentUsageRoom1);
      });

      getCalendarEventsRoom2().then(fetchedEvents => {
        setEventsRoom2(fetchedEvents);
        setTotalBookingsRoom2(fetchedEvents.length);
        summarizeWeekdays(fetchedEvents, setWeekdaySummaryRoom2);
        findTopPopularTimes(fetchedEvents, setPopularTimesRoom2);
        summarizeEquipmentUsage(fetchedEvents, setEquipmentUsageRoom2);
      });
    }
  }, [session]);

  async function getCalendarEventsRoom1() {
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com/events", {
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

  function summarizeWeekdays(events, setSummary) {
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

    setSummary(summary);
  }

  function findTopPopularTimes(events, setTimes) {
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

    setTimes(sortedTimes.slice(0, 5));
  }

  function summarizeEquipmentUsage(events, setUsage) {
    const equipmentUsage = { 'ไมโครโฟน': 0, 'โปรเจคเตอร์': 0, 'พอยเตอร์': 0 };

    events.forEach(event => {
      if (event.description) {
        const microphoneMatch = event.description.match(/ไมโครโฟน:\s*(\d+)/);
        const projectorMatch = event.description.match(/โปเจคเตอร์:\s*(\d+)/);
        const pointerMatch = event.description.match(/พอยเตอร์:\s*(\d+)/);

        if (microphoneMatch) {
          equipmentUsage['ไมโครโฟน'] += parseInt(microphoneMatch[1]);
        }
        if (projectorMatch) {
          equipmentUsage['โปรเจคเตอร์'] += parseInt(projectorMatch[1]);
        }
        if (pointerMatch) {
          equipmentUsage['พอยเตอร์'] += parseInt(pointerMatch[1]);
        }
      }
    });

    setUsage(equipmentUsage);
  }

  const equipmentChartData = {
    labels: ['ไมโครโฟน', 'โปรเจคเตอร์', 'พอยเตอร์'],
    datasets: [
      {
        label: 'ห้อง 1 (ครั้ง)',
        data: [
          equipmentUsageRoom1['ไมโครโฟน'],
          equipmentUsageRoom1['โปรเจคเตอร์'],
          equipmentUsageRoom1['พอยเตอร์']
        ],
        backgroundColor: '#42a5f5',
      },
      {
        label: 'ห้อง 2 (ครั้ง)',
        data: [
          equipmentUsageRoom2['ไมโครโฟน'],
          equipmentUsageRoom2['โปรเจคเตอร์'],
          equipmentUsageRoom2['พอยเตอร์']
        ],
        backgroundColor: '#66bb6a',
      },
    ],
  };

  const popularTimesChartData = {
    labels: popularTimesRoom1.map(item => item.time),
    datasets: [
      {
        label: 'ห้อง 1 (ครั้ง)',
        data: popularTimesRoom1.map(item => item.count),
        backgroundColor: '#42a5f5',
      },
      {
        label: 'ห้อง 2 (ครั้ง)',
        data: popularTimesRoom2.map(item => item.count),
        backgroundColor: '#66bb6a',
      },
    ],
  };

  const weekdayChartData = {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'],
    datasets: [
      {
        label: 'ห้อง 1 (ครั้ง)',
        data: weekdaySummaryRoom1.map(item => item.count),
        backgroundColor: '#42a5f5',
      },
      {
        label: 'ห้อง 2 (ครั้ง)',
        data: weekdaySummaryRoom2.map(item => item.count),
        backgroundColor: '#66bb6a',
      },
    ],
  };

  const pieChartData = {
    labels: ['ห้อง 1 (ครั้ง)', 'ห้อง 2 (ครั้ง)'],
    datasets: [
      {
        data: [totalBookingsRoom1, totalBookingsRoom2],
        backgroundColor: ['#42a5f5', '#66bb6a'],
        hoverBackgroundColor: ['#2196f3', '#4caf50'],
      },
    ],
  };

  const handleEventSelect = event => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="App">
      <div className="container mt-5">
        {session ? (
          <>
            <div className="mb-4">
              <h2 className="text-primary text-center">ยินดีต้อนรับ Admin, <span className="text-success">{session.user.email}</span></h2>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-info text-white rounded">ปฏิทินการจองห้องประชุม 1</div>
                  <div className="card-body p-0">
                    <BigCalendar
                      localizer={localizer}
                      events={eventsRoom1}
                      onSelectEvent={handleEventSelect}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: '500px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-info text-white rounded">ปฏิทินการจองห้องประชุม 2</div>
                  <div className="card-body p-0">
                    <BigCalendar
                      localizer={localizer}
                      events={eventsRoom2}
                      onSelectEvent={handleEventSelect}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: '500px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-success text-white rounded">การใช้วัสดุอุปกรณ์ (เปรียบเทียบระหว่างห้อง)</div>
                  <div className="card-body">
                    <Bar data={equipmentChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center rounded" style={{ backgroundColor: '#ff5733', color: 'white' }}>เวลาในการจองที่ได้รับความนิยมสูงสุด (เปรียบเทียบระหว่างห้อง)</div>
                  <div className="card-body">
                    <Bar data={popularTimesChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-primary text-white rounded">สรุปจำนวนการจองในแต่ละวัน (เปรียบเทียบระหว่างห้อง)</div>
                  <div className="card-body">
                    <Bar data={weekdayChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-warning text-dark rounded">เปรียบเทียบการจองระหว่างห้องประชุม</div>
                  <div className="card-body">
                    <Pie data={pieChartData} options={{ responsive: true }} style={{ maxHeight: '300px' }} />
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
              <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => window.location.href = "https://calendar.google.com/calendar/u/0/r?cid=c_c49091981c3b59d31ba1356e5ebe59a1fad27c7c51815737ee3dff56149dce10@group.calendar.google.com"}>
                  แก้ไขข้อมูลห้องประชุม 2
              </button>
              </div>

            <div className="text-center mt-4">
              <button className="btn btn-danger btn-lg" onClick={() => supabase.auth.signOut()}>
                ออกจากระบบ
              </button>
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>รายละเอียดการจอง</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedEvent && (
      <div className="container">
        <div className="row mb-3">
          <div className="col-sm-4 font-weight-bold text-secondary">ชื่อห้องประชุม:</div>
          <div className="col-sm-8">{selectedEvent.title}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 font-weight-bold text-secondary">รายละเอียด:</div>
          <div className="col-sm-8">
            {selectedEvent.description ? (
              selectedEvent.description.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))
            ) : (
              <span className="text-muted">ไม่มี</span>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 font-weight-bold text-secondary">สถานที่:</div>
          <div className="col-sm-8">
            {selectedEvent.location || <span className="text-muted">ไม่มี</span>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 font-weight-bold text-secondary">ผู้เข้าร่วม:</div>
          <div className="col-sm-8">
            {selectedEvent.attendees?.length > 0 ? (
              selectedEvent.attendees.map((a, index) => (
                <div key={index}>{a.email}</div>
              ))
            ) : (
              <span className="text-muted">ไม่มี</span>
            )}
          </div>
        </div>
      </div>
    )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button
          style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '5px',
            padding: '8px 16px',
          }}
          onClick={handleClose}
        >
          ปิด
        </Button>
      </Modal.Footer>
    </Modal>
</>
        ) : (
          <div className="text-center">
            <h3>กรุณาเข้าสู่ระบบด้วบบัญชี ADMIN เพื่อใช้งานระบบ</h3>
            <button className="btn btn-primary rounded-pill px-4 py-2" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
              เข้าสู่ระบบด้วย Google
            </button>
          </div>
        )}
      </div>
    </div>
  );

}

export default Room1Admin;
