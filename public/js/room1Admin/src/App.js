import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Modal, Button } from 'react-bootstrap';
import Swal from "sweetalert2";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const localizer = momentLocalizer(moment);

function RoomAdmin() {
  const [eventsRoom1, setEventsRoom1] = useState([]);
  const [eventsRoom2, setEventsRoom2] = useState([]);
  const [eventsRoom3, setEventsRoom3] = useState([]);
  const [eventsRoom4, setEventsRoom4] = useState([]);
  const [eventsRoom5, setEventsRoom5] = useState([]);
  const [eventsRoom6, setEventsRoom6] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  const [currentRoom, setCurrentRoom] = useState(1);

  const [popularTimesRoom1, setPopularTimesRoom1] = useState([]);
  const [popularTimesRoom2, setPopularTimesRoom2] = useState([]);
  const [popularTimesRoom3, setPopularTimesRoom3] = useState([]);
  const [popularTimesRoom4, setPopularTimesRoom4] = useState([]);
  const [popularTimesRoom5, setPopularTimesRoom5] = useState([]);
  const [popularTimesRoom6, setPopularTimesRoom6] = useState([]);

  const [weekdaySummaryRoom1, setWeekdaySummaryRoom1] = useState([]);
  const [weekdaySummaryRoom2, setWeekdaySummaryRoom2] = useState([]);
  const [weekdaySummaryRoom3, setWeekdaySummaryRoom3] = useState([]);
  const [weekdaySummaryRoom4, setWeekdaySummaryRoom4] = useState([]);
  const [weekdaySummaryRoom5, setWeekdaySummaryRoom5] = useState([]);
  const [weekdaySummaryRoom6, setWeekdaySummaryRoom6] = useState([]);


  const [totalBookingsRoom1, setTotalBookingsRoom1] = useState(0);
  const [totalBookingsRoom2, setTotalBookingsRoom2] = useState(0);
  const [totalBookingsRoom3, setTotalBookingsRoom3] = useState(0);
  const [totalBookingsRoom4, setTotalBookingsRoom4] = useState(0);
  const [totalBookingsRoom5, setTotalBookingsRoom5] = useState(0);
  const [totalBookingsRoom6, setTotalBookingsRoom6] = useState(0);

  useEffect(() => {
    if (session) {
      getCalendarEventsRoom1().then(fetchedEvents => setEventsRoom1(fetchedEvents));
      getCalendarEventsRoom2().then(fetchedEvents => setEventsRoom2(fetchedEvents));
      getCalendarEventsRoom3().then(fetchedEvents => setEventsRoom3(fetchedEvents));
      getCalendarEventsRoom4().then(fetchedEvents => setEventsRoom4(fetchedEvents));
      getCalendarEventsRoom5().then(fetchedEvents => setEventsRoom5(fetchedEvents));
      getCalendarEventsRoom6().then(fetchedEvents => setEventsRoom6(fetchedEvents));
    }
  }, [session]);

  useEffect(() => {
    setTotalBookingsRoom1(eventsRoom1.length);
    setTotalBookingsRoom2(eventsRoom2.length);
    setTotalBookingsRoom3(eventsRoom3.length);
    setTotalBookingsRoom4(eventsRoom4.length);
    setTotalBookingsRoom5(eventsRoom5.length);
    setTotalBookingsRoom6(eventsRoom6.length);
  }, [eventsRoom1, eventsRoom2, eventsRoom3, eventsRoom4, eventsRoom5, eventsRoom6]);

  useEffect(() => {
    setPopularTimesRoom1(findTopPopularTimes(eventsRoom1));
    setPopularTimesRoom2(findTopPopularTimes(eventsRoom2));
    setPopularTimesRoom3(findTopPopularTimes(eventsRoom3));
    setPopularTimesRoom4(findTopPopularTimes(eventsRoom4));
    setPopularTimesRoom5(findTopPopularTimes(eventsRoom5));
    setPopularTimesRoom6(findTopPopularTimes(eventsRoom6));
  }, [eventsRoom1, eventsRoom2, eventsRoom3, eventsRoom4, eventsRoom5, eventsRoom6]);

  useEffect(() => {
    setWeekdaySummaryRoom1(summarizeWeekdays(eventsRoom1));
    setWeekdaySummaryRoom2(summarizeWeekdays(eventsRoom2));
    setWeekdaySummaryRoom3(summarizeWeekdays(eventsRoom3));
    setWeekdaySummaryRoom4(summarizeWeekdays(eventsRoom4));
    setWeekdaySummaryRoom5(summarizeWeekdays(eventsRoom5));
    setWeekdaySummaryRoom6(summarizeWeekdays(eventsRoom6));
  }, [eventsRoom1, eventsRoom2]);

  useEffect(() => {
    console.log("Session: ", session);
  }, [session]);


  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { scopes: 'https://www.googleapis.com/auth/calendar' }
    });

    if (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้", "error");
    }
  }

  async function getCalendarEventsRoom1() {
    return getCalendarEvents("c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com");
  }

  async function getCalendarEventsRoom2() {
    return getCalendarEvents("c_c49091981c3b59d31ba1356e5ebe59a1fad27c7c51815737ee3dff56149dce10@group.calendar.google.com");
  }

  async function getCalendarEventsRoom3() {
    return getCalendarEvents("c_f3167f0a14bd4729f7194a488b83fc4ec289510e334831049a8f92476aa24622@group.calendar.google.com");
  }

  async function getCalendarEventsRoom4() {
    return getCalendarEvents("c_9349fd476a9e740771bc73620c0006d45b181505fda20730de028f2f8de10325@group.calendar.google.com");
  }

  async function getCalendarEventsRoom5() {
    return getCalendarEvents("c_b6c44e704bb0a6238f77863629a3dabc0e748ee8af4cd1a3b438a0cbe740da8c@group.calendar.google.com");
  }

  async function getCalendarEventsRoom6() {
    return getCalendarEvents("c_97923f05a9e6c79b7516856b54a834ae0ba29ea558d69a3cff389a6f2ff44252@group.calendar.google.com");
  }



  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถออกจากระบบได้", "error");
    } else {
      window.location.reload(); // รีโหลดหน้าเพื่อล้าง session
    }
  }



  async function getCalendarEvents(calendarId) {
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
      method: "GET",
      headers: {
        Authorization: 'Bearer ' + session.provider_token,
      },
    });

    if (!response.ok) {
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

    return Object.entries(timeSummary)
      .map(([hour, count]) => ({ time: `${hour}:00 - ${parseInt(hour) + 1}:00`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // เอาเฉพาะ 5 อันดับแรก
  }


  function summarizeWeekdays(events) {
    const weekdayCounts = Array(5).fill(0); // จันทร์ - ศุกร์

    events.forEach(event => {
      const day = event.start.getDay();
      if (day >= 1 && day <= 5) { // นับเฉพาะวันจันทร์ - ศุกร์
        weekdayCounts[day - 1]++;
      }
    });

    const weekdays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
    return weekdays.map((name, index) => ({
      day: name,
      count: weekdayCounts[index]
    }));
  }

  const summarizeEquipmentUsage = (events) => {
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

    return equipmentUsage;
  };

  const equipmentChartData = {
    labels: ['ไมโครโฟน', 'โปรเจคเตอร์', 'พอยเตอร์'],
    datasets: [
      {
        label: 'ห้อง 1 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom1)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom1)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom1)['พอยเตอร์'],
        ],
        backgroundColor: '#42a5f5',
      },
      {
        label: 'ห้อง 2 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom2)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom2)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom2)['พอยเตอร์'],
        ],
        backgroundColor: '#66bb6a',
      },
      {
        label: 'ห้อง 3 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom3)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom3)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom3)['พอยเตอร์'],
        ],
        backgroundColor: '#ff8c00',
      },
      {
        label: 'ห้อง 4 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom4)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom4)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom4)['พอยเตอร์'],
        ],
        backgroundColor: '#ff5733',
      },
      {
        label: 'ห้อง 5 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom5)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom5)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom5)['พอยเตอร์'],
        ],
        backgroundColor: '#8e44ad',
      },
      {
        label: 'ห้อง 6 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom6)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom6)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom6)['พอยเตอร์'],
        ],
        backgroundColor: '#FFEB3B',
      },
    ],
  };

  const popularTimesChartData = {
    labels: ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'],
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
      {
        label: 'ห้อง 3 (ครั้ง)',
        data: popularTimesRoom3.map(item => item.count),
        backgroundColor: '#ff8c00',
      },
      {
        label: 'ห้อง 4 (ครั้ง)',
        data: popularTimesRoom4.map(item => item.count),
        backgroundColor: '#ff5733',
      },
      {
        label: 'ห้อง 5 (ครั้ง)',
        data: popularTimesRoom5.map(item => item.count),
        backgroundColor: '#8e44ad',
      },
      {
        label: 'ห้อง 6 (ครั้ง)',
        data: popularTimesRoom6.map(item => item.count),
        backgroundColor: '#FFEB3B',
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
      {
        label: 'ห้อง 3 (ครั้ง)',
        data: weekdaySummaryRoom3.map(item => item.count),
        backgroundColor: '#ff8c00',
      },
      {
        label: 'ห้อง 4 (ครั้ง)',
        data: weekdaySummaryRoom4.map(item => item.count),
        backgroundColor: '#ff5733',
      },
      {
        label: 'ห้อง 5 (ครั้ง)',
        data: weekdaySummaryRoom5.map(item => item.count),
        backgroundColor: '#8e44ad',
      },
      {
        label: 'ห้อง 6 (ครั้ง)',
        data: weekdaySummaryRoom6.map(item => item.count),
        backgroundColor: '#FFEB3B',
      },
    ],
  };

  const pieChartData = {
    labels: ['ห้อง 1 (ครั้ง)', 'ห้อง 2 (ครั้ง)', 'ห้อง 3 (ครั้ง)', 'ห้อง 4 (ครั้ง)', 'ห้อง 5 (ครั้ง)', 'ห้อง 6 (ครั้ง)'],
    datasets: [
      {
        data: [totalBookingsRoom1, totalBookingsRoom2, totalBookingsRoom3, totalBookingsRoom4, totalBookingsRoom5, totalBookingsRoom6],
        backgroundColor: ['#42a5f5', '#66bb6a', '#ff8c00', '#ff5733', '#8e44ad', '#FFEB3B'],
        hoverBackgroundColor: ['#42a5f5', '#66bb6a', '#ff8c00', '#ff5733', '#8e44ad', '#FFEB3B'],
      },
    ],
  };

  const handleEventSelect = event => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  if (isLoading) return <></>;

  // ✅ **หน้าเข้าสู่ระบบ**
  if (!session) {
    return (
      <div className="App">
        <div className="login-container">
          <div className="login-box">
            <h2 className="text-center">กรุณาเข้าสู่ระบบด้วยบัญชี ADMIN เพื่อใช้งานระบบ</h2>
            <button
              className="btn btn-success login-btn"
              onClick={googleSignIn}
            >
              เข้าสู่ระบบด้วย Google
            </button>
          </div>
        </div>
      </div>
    );
  }




  // ✅ **หน้าหลังเข้าสู่ระบบ**
  return (
    <div className="App">
      <div className="container mt-5">
        <div className="text-center mb-4">
          <div className="d-flex flex-wrap justify-content-center">
            <h2 style={{ border: "3px solid #28A745", padding: "15px 20px", borderRadius: "10px", textAlign: "center", backgroundColor: "#DFF6DD", color: "#155724", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)" }}>
              ยินดีต้อนรับ, {session?.user?.email} ห้องหมายเลข {currentRoom}
            </h2>
            <a href="#" onClick={() => setCurrentRoom(1)} className="btn mx-2 my-1" style={{ backgroundColor: '#42a5f5', color: 'white' }}>ดูปฏิทินห้องประชุม 1</a>
            <a href="#" onClick={() => setCurrentRoom(2)} className="btn mx-2 my-1" style={{ backgroundColor: '#66bb6a', color: 'white' }}>ดูปฏิทินห้องประชุม 2</a>
            <a href="#" onClick={() => setCurrentRoom(3)} className="btn mx-2 my-1" style={{ backgroundColor: '#ff8c00', color: 'white' }}>ดูปฏิทินห้องประชุม 3</a>
            <a href="#" onClick={() => setCurrentRoom(4)} className="btn mx-2 my-1" style={{ backgroundColor: '#ff5733', color: 'white' }}>ดูปฏิทินห้องประชุม 4</a>
            <a href="#" onClick={() => setCurrentRoom(5)} className="btn mx-2 my-1" style={{ backgroundColor: '#8e44ad', color: 'white' }}>ดูปฏิทินห้องประชุม 5</a>
            <a href="#" onClick={() => setCurrentRoom(6)} className="btn mx-2 my-1" style={{ backgroundColor: '#FFEB3B', color: 'white' }}>ดูปฏิทินห้องประชุม 6</a>
          </div>
        </div>
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={currentRoom === 1 ? eventsRoom1 : currentRoom === 2 ? eventsRoom2 : currentRoom === 3 ? eventsRoom3 : currentRoom === 4 ? eventsRoom4 : currentRoom === 5 ? eventsRoom5 : eventsRoom6}
            startAccessor="start"
            endAccessor="end"
            style={{ height: window.innerWidth < 768 ? '500px' : '700px' }}
            onSelectEvent={handleEventSelect}
          />
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
            <Button onClick={handleClose} style={{ backgroundColor: 'red', color: 'white', borderRadius: '5px', padding: '8px 16px' }}>ปิด</Button>
          </Modal.Footer>
        </Modal>

        {/* กราฟการใช้งานวัสดุอุปกรณ์ */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header text-center bg-success text-white rounded">การใช้วัสดุอุปกรณ์ (เปรียบเทียบระหว่างห้อง)</div>
              <div className="card-body">
                <Bar data={equipmentChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>

          {/* กราฟเวลาที่ได้รับความนิยม */}
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header text-center rounded" style={{ backgroundColor: '#ff5733', color: 'white' }}>เวลาในการจองที่ได้รับความนิยมสูงสุด (เปรียบเทียบระหว่างห้อง)</div>
              <div className="card-body">
                <Bar data={popularTimesChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>

        {/* กราฟการจองในแต่ละวัน */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header text-center bg-primary text-white rounded">สรุปจำนวนการจองในแต่ละวัน (เปรียบเทียบระหว่างห้อง)</div>
              <div className="card-body">
                <Bar data={weekdayChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>

          {/* เปรียบเทียบการจองระหว่างห้อง */}
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header text-center bg-warning text-dark rounded">เปรียบเทียบการจองระหว่างห้องประชุม</div>
              <div className="card-body">
                <Pie data={pieChartData} options={{ responsive: true }} style={{ maxHeight: '300px' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          <button
            className="btn mx-2 w-100 my-2"
            style={{ backgroundColor: '#ff8c00', color: 'white' }}
            onClick={() => window.location.href = "https://calendar.google.com/calendar/u/0/r?cid=c_c49091981c3b59d31ba1356e5ebe59a1fad27c7c51815737ee3dff56149dce10@group.calendar.google.com"}
          >
            แก้ไขข้อมูลห้องประชุม
          </button>
        </div>


        <div className="text-center mt-4">
          <button
            className="btn btn-danger btn-lg"
            onClick={signOut}
          >
            ออกจากระบบ
          </button>
          <a href="https://hoomebookingroom.web.app"
            className="btn back-btn"
            style={{
              backgroundColor: "#007bff", // สีฟ้าน้ำเงิน
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
              textAlign: "center"
            }}>
            กลับหน้าหลัก
          </a>

        </div>



      </div>
    </div>



  );
}

export default RoomAdmin;
