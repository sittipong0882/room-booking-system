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
  const [eventsRoom7, setEventsRoom7] = useState([]);
  const [eventsRoom8, setEventsRoom8] = useState([]);
  const [eventsRoom9, setEventsRoom9] = useState([]);
  const [eventsRoom10, setEventsRoom10] = useState([]);


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
  const [popularTimesRoom7, setPopularTimesRoom7] = useState([]);
  const [popularTimesRoom8, setPopularTimesRoom8] = useState([]);
  const [popularTimesRoom9, setPopularTimesRoom9] = useState([]);
  const [popularTimesRoom10, setPopularTimesRoom10] = useState([]);

  const [weekdaySummaryRoom1, setWeekdaySummaryRoom1] = useState([]);
  const [weekdaySummaryRoom2, setWeekdaySummaryRoom2] = useState([]);
  const [weekdaySummaryRoom3, setWeekdaySummaryRoom3] = useState([]);
  const [weekdaySummaryRoom4, setWeekdaySummaryRoom4] = useState([]);
  const [weekdaySummaryRoom5, setWeekdaySummaryRoom5] = useState([]);
  const [weekdaySummaryRoom6, setWeekdaySummaryRoom6] = useState([]);
  const [weekdaySummaryRoom7, setWeekdaySummaryRoom7] = useState([]);
  const [weekdaySummaryRoom8, setWeekdaySummaryRoom8] = useState([]);
  const [weekdaySummaryRoom9, setWeekdaySummaryRoom9] = useState([]);
  const [weekdaySummaryRoom10, setWeekdaySummaryRoom10] = useState([]);

  const [totalBookingsRoom1, setTotalBookingsRoom1] = useState(0);
  const [totalBookingsRoom2, setTotalBookingsRoom2] = useState(0);
  const [totalBookingsRoom3, setTotalBookingsRoom3] = useState(0);
  const [totalBookingsRoom4, setTotalBookingsRoom4] = useState(0);
  const [totalBookingsRoom5, setTotalBookingsRoom5] = useState(0);
  const [totalBookingsRoom6, setTotalBookingsRoom6] = useState(0);
  const [totalBookingsRoom7, setTotalBookingsRoom7] = useState(0);
  const [totalBookingsRoom8, setTotalBookingsRoom8] = useState(0);
  const [totalBookingsRoom9, setTotalBookingsRoom9] = useState(0);
  const [totalBookingsRoom10, setTotalBookingsRoom10] = useState(0);

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ต้องการลบการจองนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${currentRoom === 1 ? 'c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com' :
              currentRoom === 2 ? 'c_c49091981c3b59d31ba1356e5ebe59a1fad27c7c51815737ee3dff56149dce10@group.calendar.google.com' :
                currentRoom === 3 ? 'c_f3167f0a14bd4729f7194a488b83fc4ec289510e334831049a8f92476aa24622@group.calendar.google.com' :
                  currentRoom === 4 ? 'c_9349fd476a9e740771bc73620c0006d45b181505fda20730de028f2f8de10325@group.calendar.google.com' :
                    currentRoom === 5 ? 'c_b6c44e704bb0a6238f77863629a3dabc0e748ee8af4cd1a3b438a0cbe740da8c@group.calendar.google.com' :
                      currentRoom === 6 ? 'c_97923f05a9e6c79b7516856b54a834ae0ba29ea558d69a3cff389a6f2ff44252@group.calendar.google.com' :
                        currentRoom === 7 ? 'c_742a41e97b6b7fa079941df5c3b76efc036454acd11f7817b2eed9ffd89c4d69@group.calendar.google.com' :
                          currentRoom === 8 ? 'c_8b061dc7f81545b067a50ca597ee4a6be6abdc1aadeb85fa68525c86524bf603@group.calendar.google.com' :
                            currentRoom === 9 ? 'c_bf4fa159c372ee417a9d10c2514933caa8cbfe2037137ddcaa695dcbbcbcfe88@group.calendar.google.com' :
                              'c_b7c5b7960d5b1d32a0b629fe71012a533de7e7329ed492e6d56a014d9f22224e@group.calendar.google.com'
            }/events/${selectedEvent.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session.provider_token}`,
              },
            }
          );

          if (response.ok) {
            Swal.fire("ลบสำเร็จ!", "การจองถูกลบเรียบร้อยแล้ว", "success");

            // รีเฟรชอีเวนต์ในปฏิทิน
            switch (currentRoom) {
              case 1: getCalendarEventsRoom1().then(setEventsRoom1); break;
              case 2: getCalendarEventsRoom2().then(setEventsRoom2); break;
              case 3: getCalendarEventsRoom3().then(setEventsRoom3); break;
              case 4: getCalendarEventsRoom4().then(setEventsRoom4); break;
              case 5: getCalendarEventsRoom5().then(setEventsRoom5); break;
              case 6: getCalendarEventsRoom6().then(setEventsRoom6); break;
              case 7: getCalendarEventsRoom7().then(setEventsRoom7); break;
              case 8: getCalendarEventsRoom8().then(setEventsRoom8); break;
              case 9: getCalendarEventsRoom9().then(setEventsRoom9); break;
              case 10: getCalendarEventsRoom10().then(setEventsRoom10); break;
              default: break;
            }

            setShowModal(false);
          } else {
            Swal.fire("ผิดพลาด!", "ไม่สามารถลบการจองได้", "error");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          Swal.fire("ผิดพลาด!", "เกิดข้อผิดพลาดในการลบ", "error");
        }
      }
    });
  };


  const [calendarBgColor, setCalendarBgColor] = useState("#42a5f5"); // สีเริ่มต้น (ห้อง 1)

  const handleRoomChange = (roomNumber, color) => {
    setCurrentRoom(roomNumber);
    setCalendarBgColor(color);
  };

  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: calendarBgColor, // สีพื้นหลังของ Event
        color: "#ffffff", // สีตัวอักษรเป็นขาว
        borderRadius: "5px",
        padding: "5px",
        border: "none"
      }
    };
  };



  useEffect(() => {
    if (session) {
      getCalendarEventsRoom1().then(fetchedEvents => setEventsRoom1(fetchedEvents));
      getCalendarEventsRoom2().then(fetchedEvents => setEventsRoom2(fetchedEvents));
      getCalendarEventsRoom3().then(fetchedEvents => setEventsRoom3(fetchedEvents));
      getCalendarEventsRoom4().then(fetchedEvents => setEventsRoom4(fetchedEvents));
      getCalendarEventsRoom5().then(fetchedEvents => setEventsRoom5(fetchedEvents));
      getCalendarEventsRoom6().then(fetchedEvents => setEventsRoom6(fetchedEvents));
      getCalendarEventsRoom7().then(fetchedEvents => setEventsRoom7(fetchedEvents)); // ✅ ห้อง 7
      getCalendarEventsRoom8().then(fetchedEvents => setEventsRoom8(fetchedEvents)); // ✅ ห้อง 8
      getCalendarEventsRoom9().then(fetchedEvents => setEventsRoom9(fetchedEvents)); // ✅ ห้อง 9
      getCalendarEventsRoom10().then(fetchedEvents => setEventsRoom10(fetchedEvents)); // ✅ ห้อง 10
    }
  }, [session]);

  useEffect(() => {
    setTotalBookingsRoom1(eventsRoom1.length);
    setTotalBookingsRoom2(eventsRoom2.length);
    setTotalBookingsRoom3(eventsRoom3.length);
    setTotalBookingsRoom4(eventsRoom4.length);
    setTotalBookingsRoom5(eventsRoom5.length);
    setTotalBookingsRoom6(eventsRoom6.length);
    setTotalBookingsRoom7(eventsRoom7.length);
    setTotalBookingsRoom8(eventsRoom8.length);
    setTotalBookingsRoom9(eventsRoom9.length);
    setTotalBookingsRoom10(eventsRoom10.length);
  }, [eventsRoom1, eventsRoom2, eventsRoom3, eventsRoom4, eventsRoom5, eventsRoom6, eventsRoom7, eventsRoom8, eventsRoom9, eventsRoom10]);


  useEffect(() => {
    setPopularTimesRoom1(findTopPopularTimes(eventsRoom1));
    setPopularTimesRoom2(findTopPopularTimes(eventsRoom2));
    setPopularTimesRoom3(findTopPopularTimes(eventsRoom3));
    setPopularTimesRoom4(findTopPopularTimes(eventsRoom4));
    setPopularTimesRoom5(findTopPopularTimes(eventsRoom5));
    setPopularTimesRoom6(findTopPopularTimes(eventsRoom6));
    setPopularTimesRoom7(findTopPopularTimes(eventsRoom7));
    setPopularTimesRoom8(findTopPopularTimes(eventsRoom8));
    setPopularTimesRoom9(findTopPopularTimes(eventsRoom9));
    setPopularTimesRoom10(findTopPopularTimes(eventsRoom10));
  }, [eventsRoom1, eventsRoom2, eventsRoom3, eventsRoom4, eventsRoom5, eventsRoom6, eventsRoom7, eventsRoom8, eventsRoom9, eventsRoom10]);

  useEffect(() => {
    setWeekdaySummaryRoom1(summarizeWeekdays(eventsRoom1));
    setWeekdaySummaryRoom2(summarizeWeekdays(eventsRoom2));
    setWeekdaySummaryRoom3(summarizeWeekdays(eventsRoom3));
    setWeekdaySummaryRoom4(summarizeWeekdays(eventsRoom4));
    setWeekdaySummaryRoom5(summarizeWeekdays(eventsRoom5));
    setWeekdaySummaryRoom6(summarizeWeekdays(eventsRoom6));
    setWeekdaySummaryRoom7(summarizeWeekdays(eventsRoom7));
    setWeekdaySummaryRoom8(summarizeWeekdays(eventsRoom8));
    setWeekdaySummaryRoom9(summarizeWeekdays(eventsRoom9));
    setWeekdaySummaryRoom10(summarizeWeekdays(eventsRoom10));
  }, [eventsRoom1, eventsRoom2, eventsRoom3, eventsRoom4, eventsRoom5, eventsRoom6, eventsRoom7, eventsRoom8, eventsRoom9, eventsRoom10]);
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

  async function getCalendarEventsRoom7() {
    return getCalendarEvents("c_742a41e97b6b7fa079941df5c3b76efc036454acd11f7817b2eed9ffd89c4d69@group.calendar.google.com");
  }

  async function getCalendarEventsRoom8() {
    return getCalendarEvents("c_8b061dc7f81545b067a50ca597ee4a6be6abdc1aadeb85fa68525c86524bf603@group.calendar.google.com");
  }

  async function getCalendarEventsRoom9() {
    return getCalendarEvents("c_bf4fa159c372ee417a9d10c2514933caa8cbfe2037137ddcaa695dcbbcbcfe88@group.calendar.google.com");
  }

  async function getCalendarEventsRoom10() {
    return getCalendarEvents("c_b7c5b7960d5b1d32a0b629fe71012a533de7e7329ed492e6d56a014d9f22224e@group.calendar.google.com");
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
    const equipmentUsage = { 'ไมโครโฟน': 0, 'โปรเจคเตอร์': 0, 'พอยเตอร์': 0, 'คอมพิวเตอร์': 0 }; // ✅ เพิ่มคอมพิวเตอร์

    events.forEach(event => {
      if (event.description) {
        const microphoneMatch = event.description.match(/ไมโครโฟน:\s*(\d+)/);
        const projectorMatch = event.description.match(/โปเจคเตอร์:\s*(\d+)/);
        const pointerMatch = event.description.match(/พอยเตอร์:\s*(\d+)/);
        const computerMatch = event.description.match(/คอมพิวเตอร์:\s*(\d+)/); // ✅ ตรวจจับคอมพิวเตอร์

        if (microphoneMatch) {
          equipmentUsage['ไมโครโฟน'] += parseInt(microphoneMatch[1]);
        }
        if (projectorMatch) {
          equipmentUsage['โปรเจคเตอร์'] += parseInt(projectorMatch[1]);
        }
        if (pointerMatch) {
          equipmentUsage['พอยเตอร์'] += parseInt(pointerMatch[1]);
        }
        if (computerMatch) {
          equipmentUsage['คอมพิวเตอร์'] += parseInt(computerMatch[1]); // ✅ เพิ่มคอมพิวเตอร์
        }
      }
    });

    return equipmentUsage;
  };


  const equipmentChartData = {
    labels: ['ไมโครโฟน', 'โปรเจคเตอร์', 'พอยเตอร์', 'คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
    datasets: [
      {
        label: 'ห้อง 1 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom1)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom1)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom1)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom1)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#42a5f5',
      },
      {
        label: 'ห้อง 2 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom2)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom2)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom2)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom2)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#66bb6a',
      },
      {
        label: 'ห้อง 3 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom3)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom3)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom3)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom3)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#ff8c00',
      },
      {
        label: 'ห้อง 4 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom4)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom4)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom4)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom4)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#ff5733',
      },
      {
        label: 'ห้อง 5 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom5)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom5)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom5)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom5)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#8e44ad',
      },
      {
        label: 'ห้อง 6 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom6)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom6)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom6)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom6)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#FFEB3B',
      },
      {
        label: 'ห้อง 7 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom7)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom7)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom7)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom7)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#FF4500',
      },
      {
        label: 'ห้อง 8 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom8)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom8)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom8)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom8)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#00CED1',
      },
      {
        label: 'ห้อง 9 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom9)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom9)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom9)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom9)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#4682B4',
      },
      {
        label: 'ห้อง 10 (ครั้ง)',
        data: [
          summarizeEquipmentUsage(eventsRoom10)['ไมโครโฟน'],
          summarizeEquipmentUsage(eventsRoom10)['โปรเจคเตอร์'],
          summarizeEquipmentUsage(eventsRoom10)['พอยเตอร์'],
          summarizeEquipmentUsage(eventsRoom10)['คอมพิวเตอร์'], // ✅ เพิ่มคอมพิวเตอร์
        ],
        backgroundColor: '#D2691E',
      },
    ],
  };

  const popularTimesChartData = {
    labels: ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'],
    datasets: [
      { label: 'ห้อง 1 (ครั้ง)', data: popularTimesRoom1.map(item => item.count), backgroundColor: '#42a5f5' },
      { label: 'ห้อง 2 (ครั้ง)', data: popularTimesRoom2.map(item => item.count), backgroundColor: '#66bb6a' },
      { label: 'ห้อง 3 (ครั้ง)', data: popularTimesRoom3.map(item => item.count), backgroundColor: '#ff8c00' },
      { label: 'ห้อง 4 (ครั้ง)', data: popularTimesRoom4.map(item => item.count), backgroundColor: '#ff5733' },
      { label: 'ห้อง 5 (ครั้ง)', data: popularTimesRoom5.map(item => item.count), backgroundColor: '#8e44ad' },
      { label: 'ห้อง 6 (ครั้ง)', data: popularTimesRoom6.map(item => item.count), backgroundColor: '#FFEB3B' },
      { label: 'ห้อง 7 (ครั้ง)', data: popularTimesRoom7.map(item => item.count), backgroundColor: '#FF4500' },
      { label: 'ห้อง 8 (ครั้ง)', data: popularTimesRoom8.map(item => item.count), backgroundColor: '#00CED1' },
      { label: 'ห้อง 9 (ครั้ง)', data: popularTimesRoom9.map(item => item.count), backgroundColor: '#4682B4' },
      { label: 'ห้อง 10 (ครั้ง)', data: popularTimesRoom10.map(item => item.count), backgroundColor: '#D2691E' },
    ],
  };

  const weekdayChartData = {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'],
    datasets: [
      { label: 'ห้อง 1 (ครั้ง)', data: weekdaySummaryRoom1.map(item => item.count), backgroundColor: '#42a5f5' },
      { label: 'ห้อง 2 (ครั้ง)', data: weekdaySummaryRoom2.map(item => item.count), backgroundColor: '#66bb6a' },
      { label: 'ห้อง 3 (ครั้ง)', data: weekdaySummaryRoom3.map(item => item.count), backgroundColor: '#ff8c00' },
      { label: 'ห้อง 4 (ครั้ง)', data: weekdaySummaryRoom4.map(item => item.count), backgroundColor: '#ff5733' },
      { label: 'ห้อง 5 (ครั้ง)', data: weekdaySummaryRoom5.map(item => item.count), backgroundColor: '#8e44ad' },
      { label: 'ห้อง 6 (ครั้ง)', data: weekdaySummaryRoom6.map(item => item.count), backgroundColor: '#FFEB3B' },
      { label: 'ห้อง 7 (ครั้ง)', data: weekdaySummaryRoom7.map(item => item.count), backgroundColor: '#FF4500' },
      { label: 'ห้อง 8 (ครั้ง)', data: weekdaySummaryRoom8.map(item => item.count), backgroundColor: '#00CED1' },
      { label: 'ห้อง 9 (ครั้ง)', data: weekdaySummaryRoom9.map(item => item.count), backgroundColor: '#4682B4' },
      { label: 'ห้อง 10 (ครั้ง)', data: weekdaySummaryRoom10.map(item => item.count), backgroundColor: '#D2691E' },
    ],
  };

  const pieChartData = {
    labels: ['ห้อง 1 (ครั้ง)', 'ห้อง 2 (ครั้ง)', 'ห้อง 3 (ครั้ง)', 'ห้อง 4 (ครั้ง)', 'ห้อง 5 (ครั้ง)', 'ห้อง 6 (ครั้ง)', 'ห้อง 7 (ครั้ง)', 'ห้อง 8 (ครั้ง)', 'ห้อง 9 (ครั้ง)', 'ห้อง 10 (ครั้ง)'],
    datasets: [
      {
        data: [
          totalBookingsRoom1, totalBookingsRoom2, totalBookingsRoom3, totalBookingsRoom4, totalBookingsRoom5,
          totalBookingsRoom6, totalBookingsRoom7, totalBookingsRoom8, totalBookingsRoom9, totalBookingsRoom10,
        ],
        backgroundColor: ['#42a5f5', '#66bb6a', '#ff8c00', '#ff5733', '#8e44ad', '#FFEB3B', '#FF4500', '#00CED1', '#4682B4', '#D2691E'],
        hoverBackgroundColor: ['#42a5f5', '#66bb6a', '#ff8c00', '#ff5733', '#8e44ad', '#FFEB3B', '#FF4500', '#00CED1', '#4682B4', '#D2691E'],
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
            <a href="#" onClick={() => handleRoomChange(1, "#42a5f5")} className="btn mx-2 my-1" style={{ backgroundColor: '#42a5f5', color: 'white' }}>ดูปฏิทินห้องประชุม 1</a>
            <a href="#" onClick={() => handleRoomChange(2, "#66bb6a")} className="btn mx-2 my-1" style={{ backgroundColor: '#66bb6a', color: 'white' }}>ดูปฏิทินห้องประชุม 2</a>
            <a href="#" onClick={() => handleRoomChange(3, "#ff8c00")} className="btn mx-2 my-1" style={{ backgroundColor: '#ff8c00', color: 'white' }}>ดูปฏิทินห้องประชุม 3</a>
            <a href="#" onClick={() => handleRoomChange(4, "#ff5733")} className="btn mx-2 my-1" style={{ backgroundColor: '#ff5733', color: 'white' }}>ดูปฏิทินห้องประชุม 4</a>
            <a href="#" onClick={() => handleRoomChange(5, "#8e44ad")} className="btn mx-2 my-1" style={{ backgroundColor: '#8e44ad', color: 'white' }}>ดูปฏิทินห้องประชุม 5</a>
            <a href="#" onClick={() => handleRoomChange(6, "#FFEB3B")} className="btn mx-2 my-1" style={{ backgroundColor: '#FFEB3B', color: 'white' }}>ดูปฏิทินห้องประชุม 6</a>
            <a href="#" onClick={() => handleRoomChange(7, "#FF4500")} className="btn mx-2 my-1" style={{ backgroundColor: '#FF4500', color: 'white' }}>ดูปฏิทินห้องประชุม 7</a>
            <a href="#" onClick={() => handleRoomChange(8, "#00CED1")} className="btn mx-2 my-1" style={{ backgroundColor: '#00CED1', color: 'white' }}>ดูปฏิทินห้องประชุม 8</a>
            <a href="#" onClick={() => handleRoomChange(9, "#4682B4")} className="btn mx-2 my-1" style={{ backgroundColor: '#4682B4', color: 'white' }}>ดูปฏิทินห้องประชุม 9</a>
            <a href="#" onClick={() => handleRoomChange(10, "#D2691E")} className="btn mx-2 my-1" style={{ backgroundColor: '#D2691E', color: 'white' }}>ดูปฏิทินห้องประชุม 10</a>
          </div>
        </div>
        <div className="calendar-container" style={{ backgroundColor: calendarBgColor, padding: "10px", borderRadius: "10px" }}>
          <Calendar
            localizer={localizer}
            events={
              currentRoom === 1 ? eventsRoom1 :
                currentRoom === 2 ? eventsRoom2 :
                  currentRoom === 3 ? eventsRoom3 :
                    currentRoom === 4 ? eventsRoom4 :
                      currentRoom === 5 ? eventsRoom5 :
                        currentRoom === 6 ? eventsRoom6 :
                          currentRoom === 7 ? eventsRoom7 :
                            currentRoom === 8 ? eventsRoom8 :
                              currentRoom === 9 ? eventsRoom9 :
                                eventsRoom10
            }
            startAccessor="start"
            endAccessor="end"
            style={{ height: "700px", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventPropGetter} // ✅ กำหนดสีของรายละเอียด
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
                  <div className="col-sm-4 font-weight-bold text-secondary">เวลาเริ่ม:</div>
                  <div className="col-sm-8">
                    {moment(selectedEvent.start).format('HH:mm')} น.
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 font-weight-bold text-secondary">เวลาสิ้นสุด:</div>
                  <div className="col-sm-8">
                    {moment(selectedEvent.end).format('HH:mm')} น.
                  </div>
                </div>
              
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button onClick={handleDeleteEvent} style={{ backgroundColor: '#d33', color: 'white', borderRadius: '5px', padding: '8px 16px' }}>
              ลบการจอง
            </Button>
            <Button onClick={handleClose} style={{ backgroundColor: '#6c757d', color: 'white', borderRadius: '5px', padding: '8px 16px' }}>
              ปิด
            </Button>
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
