import {
   AlertTriangle,
   Box,
   CheckCircle,
   ChevronRight,
   Clock,
   Download,
   LayoutGrid,
   Store,
   TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
   Bar,
   BarChart,
   CartesianGrid,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from "recharts";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useMockData } from "../context/MockDataContext";
import { exportToCSV } from "../lib/exportUtils";

const auditTrendData = [
   { name: "Mon", audits: 4 },
   { name: "Tue", audits: 6 },
   { name: "Wed", audits: 3 },
   { name: "Thu", audits: 8 },
   { name: "Fri", audits: 5 },
   { name: "Sat", audits: 2 },
   { name: "Sun", audits: 1 },
];

export default function Dashboard() {
   const { user } = useAuth();
   const { audits, stores, schedules } = useMockData();
   const navigate = useNavigate();

   const isManager = user?.role === "RETAIL_OPS_HEAD";

   if (!isManager) {
      const todaySchedules = schedules.filter(
         (s) =>
            s.assignedTo === user.id &&
            s.date === new Date().toISOString().split("T")[0],
      );
      const upcomingSchedules = schedules.filter(
         (s) =>
            s.assignedTo === user.id &&
            s.date > new Date().toISOString().split("T")[0],
      );
      const myAudits = audits.filter((a) => a.merchandiserId === user.id);
      const assignedStoresCount = user?.assignedLocations?.length || 0;

      return (
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-bold text-text">
                  Welcome back, {user?.firstName}
               </h1>
               <p className="text-text-secondary mt-1 text-sm md:text-base">
                  Your daily merchandising tasks and schedule.
               </p>
            </div>

            <div className="bg-primary text-white p-6 md:p-8 rounded-2xl shadow-md relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Ready to scan?</h2>
                  <p className="text-primary-light mb-6 max-w-md">
                     Scan your completed merchandising form and let AI extract
                     the audit details for review.
                  </p>
                  <Button
                     className="bg-white text-primary hover:bg-gray-100 font-bold shadow-sm"
                     onClick={() => navigate("/scan")}
                  >
                     Scan Merchandising Form
                  </Button>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10">
                  <LayoutGrid className="w-48 h-48 -mb-12 -mr-12" />
               </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-5">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-sm font-medium text-text-secondary">
                              Assigned Stores
                           </p>
                           <p className="text-3xl font-bold text-text mt-2">
                              {assignedStoresCount}
                           </p>
                        </div>
                        <div className="p-2.5 bg-gray-50 rounded-lg text-primary">
                           <Store className="w-5 h-5" />
                        </div>
                     </div>
                     <p className="text-xs font-medium mt-4 text-text-secondary">
                        {todaySchedules.length + upcomingSchedules.length}{" "}
                        visits scheduled this week
                     </p>
                  </CardContent>
               </Card>

               <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-5">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-sm font-medium text-text-secondary">
                              Upcoming Visits
                           </p>
                           <p className="text-3xl font-bold text-text mt-2">
                              {upcomingSchedules.length}
                           </p>
                        </div>
                        <div className="p-2.5 bg-gray-50 rounded-lg text-primary">
                           <Clock className="w-5 h-5" />
                        </div>
                     </div>
                     <button
                        onClick={() => navigate("/schedule")}
                        className="text-xs font-bold mt-4 text-primary hover:underline flex items-center"
                     >
                        View Schedule{" "}
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                     </button>
                  </CardContent>
               </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle>Today's Visits</CardTitle>
                     <Badge variant="primary">{todaySchedules.length}</Badge>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {todaySchedules.map((schedule) => {
                           const store = stores.find(
                              (s) => s.id === schedule.storeId,
                           );
                           return (
                              <div
                                 key={schedule.id}
                                 className="flex justify-between items-center p-4 border border-border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                              >
                                 <div className="flex gap-4 items-center">
                                    <div className="font-bold text-primary">
                                       {schedule.time}
                                    </div>
                                    <div>
                                       <p className="font-bold text-text">
                                          {store?.name}
                                       </p>
                                       <p className="text-sm text-text-secondary">
                                          {schedule.activityType}
                                       </p>
                                    </div>
                                 </div>
                                 <Badge
                                    variant={
                                       schedule.status === "Scheduled"
                                          ? "default"
                                          : schedule.status === "In Progress"
                                            ? "primary"
                                            : "success"
                                    }
                                 >
                                    {schedule.status}
                                 </Badge>
                              </div>
                           );
                        })}
                        {todaySchedules.length === 0 && (
                           <p className="text-center text-text-secondary py-4">
                              No visits scheduled for today.
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle>My Recent Audits</CardTitle>
                     <button
                        onClick={() => navigate("/audits")}
                        className="text-sm font-medium text-primary hover:underline flex items-center"
                     >
                        View all <ChevronRight className="w-4 h-4" />
                     </button>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {myAudits.slice(0, 3).map((audit) => {
                           const store = stores.find(
                              (s) => s.id === audit.storeId,
                           );
                           const getAuditBadgeVariant = (status) => {
                              switch (status) {
                                 case "Approved":
                                    return "success";
                                 case "Validated":
                                    return "success";
                                 case "Pending Validation":
                                    return "warning";
                                 case "Archived":
                                    return "default";
                                 case "Scanned":
                                    return "primary";
                                 case "AI Processing":
                                    return "primary";
                                 default:
                                    return "primary";
                              }
                           };
                           return (
                              <div
                                 key={audit.id}
                                 className="flex justify-between items-center p-3 border-b border-border last:border-0 cursor-pointer group"
                                 onClick={() => navigate(`/audits/${audit.id}`)}
                              >
                                 <div>
                                    <p className="font-semibold text-text group-hover:text-primary transition-colors">
                                       {store?.name}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                       {audit.date}
                                    </p>
                                 </div>
                                 <Badge
                                    variant={getAuditBadgeVariant(audit.status)}
                                 >
                                    {audit.status}
                                 </Badge>
                              </div>
                           );
                        })}
                        {myAudits.length === 0 && (
                           <p className="text-center text-text-secondary py-4">
                              No recent audits found.
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   // RETAIL OPS HEAD VIEW
   const opsStats = [
      {
         label: "Stores Visited",
         value: "12",
         icon: Store,
         trend: "+2 this week",
      },
      {
         label: "Products Audited",
         value: "148",
         icon: Box,
         trend: "85% of target",
      },
      {
         label: "Restocking Activities",
         value: "34",
         icon: CheckCircle,
         trend: "+12% vs last week",
      },
      {
         label: "Display Issues",
         value: "3",
         icon: AlertTriangle,
         trend: "-1 from last week",
         trendDown: true,
      },
   ];

   const handleExportReport = () => {
      const dataToExport = stores.map(store => ({
         StoreName: store.name,
         StoreCode: store.code,
         Type: store.type,
         Location: `${store.city}, ${store.region}`,
         TotalAudits: store.metrics.totalAudits,
         SKUAvailability: `${store.metrics.skuAvailability}%`,
         DisplayIssues: store.metrics.displayIssues,
         StockIssues: store.metrics.stockIssues,
         Compliance: `${store.metrics.compliance}%`
      }));
      exportToCSV('Retail_Ops_Network_Performance', dataToExport);
   };

   return (
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
               <h1 className="text-2xl font-bold text-text">
                  Retail Operations Overview
               </h1>
               <p className="text-text-secondary mt-1 text-sm md:text-base">
                  Monitor network-wide performance and merchandising execution.
               </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleExportReport}>
               <Download className="w-4 h-4" /> Export Report
            </Button>
         </div>

         <div className="bg-primary-surface border border-primary-light rounded-xl p-4 md:p-5 flex gap-4 items-start shadow-sm">
            <div className="p-2.5 bg-primary rounded-lg text-white flex-shrink-0">
               <TrendingUp className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-sm font-bold text-primary">
                  AI Operations Insights
               </h3>
               <ul className="text-sm text-text-secondary mt-2 space-y-1.5 font-medium">
                  <li>
                     • <span className="text-text">System Accuracy:</span> AI
                     extraction confidence is currently averaging{" "}
                     <span className="text-primary font-bold">94%</span> across
                     all stores.
                  </li>
                  <li>
                     • <span className="text-text">Anomaly Detected:</span> Cold
                     Storage VivoCity has reported missing stock in 2
                     consecutive visits.
                  </li>
               </ul>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {opsStats.map((stat, index) => {
               const Icon = stat.icon;
               return (
                  <Card
                     key={index}
                     className="hover:border-primary/20 transition-colors"
                  >
                     <CardContent className="p-5 md:p-6">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-sm font-medium text-text-secondary">
                                 {stat.label}
                              </p>
                              <p className="text-3xl font-bold text-text mt-2">
                                 {stat.value}
                              </p>
                           </div>
                           <div className="p-2.5 bg-gray-50 rounded-lg text-primary">
                              <Icon className="w-5 h-5" />
                           </div>
                        </div>
                        <p
                           className={`text-xs font-medium mt-4 ${stat.trendDown ? "text-emerald-600" : "text-primary"}`}
                        >
                           {stat.trend}
                        </p>
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Network Audit Trend</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="h-64 md:h-80 w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                           data={auditTrendData}
                           margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                        >
                           <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#e2e8f0"
                           />
                           <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                              dy={10}
                           />
                           <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                              dx={-10}
                           />
                           <Tooltip
                              cursor={{ fill: "#f1f5f9" }}
                              contentStyle={{
                                 borderRadius: "12px",
                                 border: "1px solid #e2e8f0",
                                 boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                 padding: "12px",
                              }}
                           />
                           <Bar
                              dataKey="audits"
                              fill="#F04623"
                              radius={[6, 6, 0, 0]}
                              barSize={36}
                           />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            <Card className="flex flex-col">
               <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
                  <CardTitle>Needs Attention</CardTitle>
               </CardHeader>
               <CardContent className="flex-1">
                  <div className="space-y-4 mt-2">
                     {audits
                        .filter(
                           (a) =>
                              a.status === "Pending Validation" ||
                              a.status === "Processing Failed",
                        )
                        .map((audit) => {
                           const store = stores.find(
                              (s) => s.id === audit.storeId,
                           );
                           return (
                              <div
                                 key={audit.id}
                                 className="p-3 border border-border rounded-xl bg-gray-50 cursor-pointer hover:border-primary/30 transition-colors"
                                 onClick={() => navigate(`/audits/${audit.id}`)}
                              >
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-text-secondary">
                                       {audit.id}
                                    </span>
                                    <Badge variant="warning">
                                       {audit.status}
                                    </Badge>
                                 </div>
                                 <p className="font-semibold text-text text-sm">
                                    {store?.name}
                                 </p>
                                 <p className="text-xs text-text-secondary mt-1">
                                    Requires manual review for AI extraction.
                                 </p>
                              </div>
                           );
                        })}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
