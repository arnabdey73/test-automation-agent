import { c as createComponent, g as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_B8K-Koss.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

function ManualTestSimulator() {
  const [sessions, setSessions] = useState([]);
  const [recording, setRecording] = useState({
    isRecording: false,
    currentSession: null,
    url: ""
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedTimer, setElapsedTimer] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [replayOptions, setReplayOptions] = useState({
    stepDelay: 1e3,
    takeScreenshots: true
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info"
  });
  const [deleteSessionId, setDeleteSessionId] = useState(null);
  useEffect(() => {
    loadSessions();
  }, []);
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5e3);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  useEffect(() => {
    return () => {
      if (elapsedTimer) {
        clearInterval(elapsedTimer);
      }
    };
  }, [elapsedTimer]);
  const showAlert = (message, type = "info") => {
    setAlert({
      show: true,
      message,
      type
    });
  };
  const loadSessions = async () => {
    try {
      const response = await fetch("/api/manual-test/sessions");
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      } else {
        showAlert("Failed to load sessions: " + (data.error || "Unknown error"), "error");
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
      showAlert("Failed to load sessions. Check network connection.", "error");
    }
  };
  const startRecording = async () => {
    if (!recording.url) {
      showAlert("Please enter a URL to start recording", "error");
      return;
    }
    const sessionId = `manual_test_${Date.now()}`;
    const testName = `Manual Test ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
    setLoading(true);
    try {
      const response = await fetch("/api/manual-test/record/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: recording.url,
          sessionId,
          testName
        })
      });
      const data = await response.json();
      if (data.success) {
        setRecording({
          ...recording,
          isRecording: true,
          currentSession: data.session
        });
        setElapsedTime(0);
        const timer = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1);
        }, 1e3);
        setElapsedTimer(timer);
        showAlert("Recording started successfully", "success");
      } else {
        showAlert("Failed to start recording: " + (data.error || "Unknown error"), "error");
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      showAlert("Failed to start recording. Check network connection.", "error");
    }
    setLoading(false);
  };
  const stopRecording = async () => {
    setLoading(true);
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      setElapsedTimer(null);
    }
    try {
      const sessionId = recording.currentSession?.sessionId;
      const response = await fetch("/api/manual-test/record/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      const data = await response.json();
      if (data.success) {
        setRecording({
          isRecording: false,
          currentSession: null,
          url: ""
        });
        showAlert("Recording stopped successfully", "success");
        loadSessions();
      } else {
        showAlert("Failed to stop recording: " + (data.error || "Unknown error"), "error");
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      showAlert("Failed to stop recording. Check network connection.", "error");
    }
    setLoading(false);
  };
  const replaySession = async (sessionId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manual-test/replay/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(replayOptions)
      });
      const data = await response.json();
      if (data.success) {
        showAlert(`Replay completed with ${data.result.steps.length} steps`, "success");
      } else {
        showAlert("Failed to replay session: " + (data.error || "Unknown error"), "error");
      }
    } catch (error) {
      console.error("Failed to replay session:", error);
      showAlert("Failed to replay session. Check network connection.", "error");
    }
    setLoading(false);
  };
  const deleteSession = async (sessionId) => {
    setDeleteSessionId(sessionId);
  };
  const confirmDelete = async () => {
    if (!deleteSessionId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/manual-test/sessions/${deleteSessionId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.success) {
        showAlert("Session deleted successfully", "success");
        loadSessions();
      } else {
        showAlert("Failed to delete session: " + (data.error || "Unknown error"), "error");
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      showAlert("Failed to delete session. Check network connection.", "error");
    }
    setLoading(false);
    setDeleteSessionId(null);
  };
  const cancelDelete = () => {
    setDeleteSessionId(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-6", children: "Manual Test Simulator" }),
    alert.show && /* @__PURE__ */ jsx("div", { className: `mb-4 p-4 rounded-md ${alert.type === "success" ? "bg-green-100 border-green-400 text-green-700" : alert.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-blue-100 border-blue-400 text-blue-700"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mr-2", children: alert.type === "success" ? "✅" : alert.type === "error" ? "❌" : "ℹ️" }),
      /* @__PURE__ */ jsx("p", { children: alert.message }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setAlert({ ...alert, show: false }),
          className: "ml-auto text-gray-500 hover:text-gray-700",
          "aria-label": "Close notification",
          children: "✕"
        }
      )
    ] }) }),
    deleteSessionId && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Confirm Deletion" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6", children: "Are you sure you want to delete this session and all related files? This action cannot be undone." }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: cancelDelete,
            className: "px-4 py-2 border rounded-md hover:bg-gray-100",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmDelete,
            className: "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600",
            children: "Delete"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Record Manual Test" }),
      !recording.isRecording ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Starting URL:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              value: recording.url,
              onChange: (e) => setRecording({ ...recording, url: e.target.value }),
              placeholder: "https://example.com",
              className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: startRecording,
            disabled: loading || !recording.url,
            className: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50",
            children: loading ? "Starting..." : "Start Recording"
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border-l-4 border-red-500 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "animate-pulse bg-red-500 w-3 h-3 rounded-full mr-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-red-700 font-medium", children: "Recording in progress..." })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-red-600 mt-1", children: [
            "Session: ",
            recording.currentSession?.sessionId
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-red-600 mt-1", children: [
            "Elapsed Time: ",
            Math.floor(elapsedTime / 60),
            ":",
            String(elapsedTime % 60).padStart(2, "0")
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: stopRecording,
            disabled: loading,
            className: "bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600",
            children: loading ? "Stopping..." : "Stop Recording"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Replay Options" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "stepDelay", className: "block text-sm font-medium mb-2", children: "Step Delay (ms):" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "stepDelay",
              type: "number",
              value: replayOptions.stepDelay,
              onChange: (e) => setReplayOptions({
                ...replayOptions,
                stepDelay: parseInt(e.target.value)
              }),
              "aria-label": "Step Delay in milliseconds",
              title: "Time delay between steps during replay",
              className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "takeScreenshots",
              type: "checkbox",
              checked: replayOptions.takeScreenshots,
              onChange: (e) => setReplayOptions({
                ...replayOptions,
                takeScreenshots: e.target.checked
              }),
              "aria-label": "Take screenshots during replay",
              title: "Take screenshots during replay",
              className: "mr-2"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "takeScreenshots", className: "text-sm font-medium", children: "Take Screenshots" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Recorded Sessions" }),
      sessions.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No recorded sessions yet." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sessions.map((session) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border rounded-md p-4 hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium", children: session.sessionId }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs font-medium mr-2", children: [
                    session.totalSteps,
                    " steps"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs font-medium mr-2", children: [
                    Math.round(session.duration / 1e3),
                    "s"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: new Date(session.createdAt).toLocaleString() })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-x-2 flex items-center", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSelectedSession(
                      selectedSession?.sessionId === session.sessionId ? null : session
                    ),
                    className: "text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md border border-blue-200 hover:border-blue-400",
                    "aria-label": selectedSession?.sessionId === session.sessionId ? "Hide session details" : "View session details",
                    children: selectedSession?.sessionId === session.sessionId ? "Hide" : "View"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => replaySession(session.sessionId),
                    disabled: loading,
                    className: "bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:opacity-50",
                    "aria-label": "Replay this session",
                    children: "Replay"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => deleteSession(session.sessionId),
                    disabled: loading,
                    className: "bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 disabled:opacity-50",
                    "aria-label": "Delete this session",
                    children: "Delete"
                  }
                )
              ] })
            ] }),
            selectedSession?.sessionId === session.sessionId && /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t pt-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2", children: "Steps:" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-h-60 overflow-y-auto p-2 border rounded bg-gray-50", children: [
                session.steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "text-sm bg-white p-3 rounded shadow-sm border-l-4 border-l-blue-500", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${step.type === "click" ? "bg-green-100 text-green-800" : step.type === "input" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`,
                        children: step.type.toUpperCase()
                      }
                    ) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: new Date(step.timestamp).toLocaleTimeString() })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
                    step.selector && /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Selector:" }),
                      " ",
                      /* @__PURE__ */ jsx("code", { className: "bg-gray-100 px-1 py-0.5 rounded", children: step.selector })
                    ] }),
                    step.value && /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Value:" }),
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "text-blue-600", children: [
                        '"',
                        step.value,
                        '"'
                      ] })
                    ] }),
                    step.text && /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Text:" }),
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
                        '"',
                        step.text,
                        '"'
                      ] })
                    ] }),
                    step.url && /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "URL:" }),
                      " ",
                      /* @__PURE__ */ jsx("a", { href: step.url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline break-all", children: step.url })
                    ] }),
                    step.error && /* @__PURE__ */ jsxs("div", { className: "text-red-600 mt-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Error:" }),
                      " ",
                      step.error
                    ] })
                  ] })
                ] }, index)),
                session.steps.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center py-4", children: "No steps recorded in this session" })
              ] })
            ] })
          ]
        },
        session.sessionId
      )) })
    ] })
  ] });
}

const $$ManualTests = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Manual Test Simulator" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "ManualTestSimulator", ManualTestSimulator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/manual-test/ManualTestSimulator", "client:component-export": "default" })} </main> ` })}`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/pages/manual-tests.astro", void 0);

const $$file = "/Users/arnabd73/Documents/test-automation-agent/src/pages/manual-tests.astro";
const $$url = "/manual-tests";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ManualTests,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
