import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import Swal from "sweetalert2";

const localizer = momentLocalizer(moment);

function Room1() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(9);
  const [additionalItems, setAdditionalItems] = useState({
    projector: 0,
    laserPointer: 0,
    microphone: 0,
    computer: 0, // ✅ เพิ่มตัวเลือกคอมพิวเตอร์
  });
  const [phone, setPhone] = useState(""); // สถานะสำหรับเบอร์โทรศัพท์

  const [events, setEvents] = useState([]);

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    if (session) {
      getCalendarEvents().then(fetchedEvents => {
        setEvents(fetchedEvents);
      });
    }
  }, [session]);

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if (error) {
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function getCalendarEvents() {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com/events", {
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
      title: event.summary,
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
      isBooked: true,
      description: event.description // เก็บ description สำหรับแสดงในปฏิทิน
    }));
  }

  const getDayEvents = (date) => {
    return events.filter(event => {
      const eventDate = moment(event.start).format('YYYY-MM-DD');
      return eventDate === moment(date).format('YYYY-MM-DD');
    });
  };

  const getCalendarStatus = (date) => {
    const dayEvents = getDayEvents(date);
    if (dayEvents.length === 0) {
      return 'green'; // ไม่มีการจอง
    }
    const totalBookedHours = dayEvents.reduce((acc, event) => {
      const startHour = event.start.getHours();
      const endHour = event.end.getHours();
      return acc + (endHour - startHour);
    }, 0);

    if (totalBookedHours >= 11) { // ถ้ามีการจอง 11 ชั่วโมง (8:00 - 19:00)
      return 'red'; // จองทั้งวัน
    }

    return 'green'; // จองบางช่วงเวลา
  };

  const eventPropGetter = (event) => {
    const backgroundColor = getCalendarStatus(event.start);
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  async function createCalendarEvent() {
    //-----------------------------------//
    if (!eventName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาใส่ชื่อผู้จอง",
        text: "ชื่อผู้จองเป็นข้อมูลที่จำเป็น กรุณากรอกชื่อ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ffc107"
      });
      return;
    }
    //

    if (!phone.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาใส่หมายเลขโทรศัพท์",
        text: "หมายเลขโทรศัพท์เป็นข้อมูลที่จำเป็น กรุณากรอกหมายเลขโทรศัพท์ของคุณ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ffc107"
      });
      return;
    }

    //-----------------------------------//

    const newStart = new Date(selectedDate);
    newStart.setHours(startHour, 0, 0, 0); // ตั้งค่าวินาทีและมิลลิวินาทีให้เป็น 0

    const newEnd = new Date(selectedDate);
    newEnd.setHours(endHour, 0, 0, 0); // ตั้งค่าวินาทีและมิลลิวินาทีให้เป็น 0

    const isConflict = events.some(event => {
      return (
        (newStart >= event.start && newStart < event.end) ||
        (newEnd > event.start && newEnd <= event.end)
      );
    });

    if (isConflict) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถจองได้",
        text: "มีการจองซ้ำในช่วงเวลานี้ กรุณาเลือกเวลาอื่น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#d33"
      });
      return;
    }

    const event = {
      summary: "ห้องประชุมชัยพฤกษ์",
      description: `${eventName}\nเบอร์โทรศัพท์: ${phone}\n${eventDescription}
    ไมโครโฟน: ${additionalItems.microphone}
    โปเจคเตอร์: ${additionalItems.projector}
    พอยเตอร์: ${additionalItems.laserPointer}
    คอมพิวเตอร์: ${additionalItems.computer}`, // ✅ เพิ่มจำนวนคอมพิวเตอร์
      start: {
        dateTime: newStart.toISOString(), // ใช้ ISOString เพื่อให้แน่ใจว่าเป็นรูปแบบ UTC
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // ใช้ time zone ของเครื่องผู้ใช้
      },
      end: {
        dateTime: newEnd.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    };


    await fetch("https://www.googleapis.com/calendar/v3/calendars/c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com/events", {
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + session.provider_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        Swal.fire({
          icon: "success",
          title: "จองสำเร็จแล้ว!",
          text: "กรุณาตรวจสอบตารางเวลาในปฏิทิน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#28a745"
        }).then(() => {
          getCalendarEvents().then(fetchedEvents => {
            setEvents(fetchedEvents);
          });

          // รีเซ็ตค่าฟอร์มให้เป็นค่าเริ่มต้น
          setEventName("");
          setPhone("");
          setEventDescription("");
          setSelectedDate(new Date());
          setStartHour(8);
          setEndHour(9);
          setAdditionalItems({
            projector: 0,
            laserPointer: 0,
            microphone: 0
          });
        });
      })

      .catch(error => {
        console.error("ข้อผิดพลาดในการจอง:", error);

        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถทำการจองได้ กรุณาลองใหม่อีกครั้ง",
          confirmButtonText: "ปิด",
          confirmButtonColor: "#d33"
        });
      });
  }

  return (
    <div className="App">
      <div className="container">
        {session ? (
          <>
            <h2 style={{
              border: "3px solid #28A745", // เส้นขอบสีเขียว
              padding: "15px 20px", // เว้นระยะรอบตัวอักษร
              borderRadius: "10px", // ขอบมน
              textAlign: "center", // จัดข้อความตรงกลาง
              backgroundColor: "#DFF6DD", // พื้นหลังสีเขียวอ่อน
              color: "#155724", // สีข้อความให้เข้ากับธีม
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)" // เพิ่มเงานุ่ม ๆ
            }}>
              ยินดีต้อนรับ, {session.user.email} ห้องประชุมชัยพฤกษ์
            </h2>


            <div className="calendar-container">
              <h2 style={{
                border: "3px solid #007BFF", // เส้นขอบสีน้ำเงิน
                padding: "15px 20px", // เว้นระยะห่างขอบ
                borderRadius: "10px", // ทำให้ขอบมน
                textAlign: "center", // จัดให้อยู่ตรงกลาง
                backgroundColor: "#E3F2FD", // พื้นหลังสีน้ำเงินอ่อน
                color: "#004085", // สีข้อความให้เข้ากับธีม
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)" // เพิ่มเงาให้นุ่มๆ
              }}>
                ปฏิทินการจองห้องประชุม
              </h2>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                <h3 style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px" }}>
                  การจองเต็มทั้งวัน
                </h3>
                <h3 style={{ backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px" }}>
                  การจองว่างในบางเวลา
                </h3>
                <h3 style={{ backgroundColor: "gray", color: "white", padding: "10px", borderRadius: "5px" }}>
                  การจองว่างทั้งวัน
                </h3>
              </div>



              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                eventPropGetter={eventPropGetter}
                defaultView="week"
                formats={{
                  dayFormat: 'DD',
                  dayRangeHeaderFormat: ({ start, end }) =>
                    `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`,
                  timeGutterFormat: (date) => moment(date).format('HH:mm'),
                }}
              />
            </div>

            <hr />
            <div>
              <label>ชื่อผู้จอง:</label>
              <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} />

              <label>เบอร์โทรศัพท์:</label>
              <input
                type="text"
                value={phone}
                onChange={e => {
                  const value = e.target.value;
                  // ตรวจสอบให้ใส่เฉพาะตัวเลข
                  if (/^\d*$/.test(value)) {
                    setPhone(value);
                  }
                }}
                placeholder="กรุณากรอกเบอร์โทรศัพท์"
              />

              <label>วันที่จอง:</label>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
              />

              <label>เวลาเริ่มจอง:</label>
              <select value={startHour} onChange={e => setStartHour(parseInt(e.target.value))}>
                {[...Array(11)].map((_, index) => (
                  <option key={index} value={index + 8}>{index + 8}:00</option>
                ))}
              </select>

              <label>เวลาสิ้นสุดจอง:</label>
              <select value={endHour} onChange={e => setEndHour(parseInt(e.target.value))}>
                {[...Array(11)].map((_, index) => (
                  <option key={index} value={index + 9}>{index + 9}:00</option>
                ))}
              </select>

              <label>อุปกรณ์เสริม:</label>
              <label>ไมโครโฟน:</label>
              <select value={additionalItems.microphone} onChange={e => setAdditionalItems({ ...additionalItems, microphone: parseInt(e.target.value) })}>
                {[...Array(11).keys()].map(item => <option key={item} value={item}>{item}</option>)}
              </select>

              <label>โปเจคเตอร์:</label>
              <select value={additionalItems.projector} onChange={e => setAdditionalItems({ ...additionalItems, projector: parseInt(e.target.value) })}>
                {[...Array(11).keys()].map(item => <option key={item} value={item}>{item}</option>)}
              </select>

              <label>พอยเตอร์:</label>
              <select value={additionalItems.laserPointer} onChange={e => setAdditionalItems({ ...additionalItems, laserPointer: parseInt(e.target.value) })}>
                {[...Array(11).keys()].map(item => <option key={item} value={item}>{item}</option>)}
              </select>

              <label>คอมพิวเตอร์:</label>
              <select value={additionalItems.computer} onChange={e => setAdditionalItems({ ...additionalItems, computer: parseInt(e.target.value) })}>
                {[...Array(11).keys()].map(item => <option key={item} value={item}>{item}</option>)}
              </select>

            </div>
            <hr />
            <div className="button-group">
              <button className="btn create-btn" onClick={createCalendarEvent}>
                ยืนยันการจอง
              </button>

              <button className="btn sign-out-btn" onClick={signOut}>
                ออกจากระบบ
              </button>

              <a href="https://hoomebookingroom.web.app" className="btn back-btn">
                กลับหน้าหลัก
              </a>
            </div>
          </>

        ) : (

          //--------------------------ล็อกอิน----ห้องประชุมชัยพฤกษ์---------------------------//
          <>
            <div style={{
              display: "flex",
              flexDirection: "column", // เรียงแนวตั้ง
              justifyContent: "center", // จัดให้อยู่กึ่งกลางแนวตั้ง
              alignItems: "center", // จัดให้อยู่กึ่งกลางแนวนอน
              height: "20vh", // ให้เต็มจอแนวตั้ง
              textAlign: "center" // จัดข้อความให้อยู่ตรงกลาง
            }}>
              <h2>กรุณาเข้าสู่ระบบเพื่อจองห้องประชุมชัยพฤกษ์</h2>

              <button
                onClick={googleSignIn}
                style={{
                  backgroundColor: "#28a745", // สีเขียว
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  marginTop: "20px" // เพิ่มระยะห่างระหว่างปุ่มกับข้อความ
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#218838"} // เปลี่ยนสีเมื่อชี้
                onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}   // คืนค่าสีปกติ
              >
                เข้าสู่ระบบด้วย Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Room1;
