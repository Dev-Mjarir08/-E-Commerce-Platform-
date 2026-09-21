import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  GripVertical,
  CalendarDays,
  Monitor,
  Smartphone,
  ExternalLink,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

const initialBanners = [
  {
    id: 1,
    title: "Mega Electronics Sale",
    subtitle: "Up to 60% off on selected electronics",
    placement: "Homepage Hero",
    status: "published",
    position: 1,
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    clicks: 12840,
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "New Fashion Collection",
    subtitle: "Discover the latest styles",
    placement: "Homepage Hero",
    status: "published",
    position: 2,
    startDate: "2026-09-05",
    endDate: "2026-10-05",
    clicks: 9240,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Home Makeover Week",
    subtitle: "Transform your space with exclusive deals",
    placement: "Homepage Slider",
    status: "draft",
    position: 3,
    startDate: "2026-09-20",
    endDate: "2026-10-20",
    clicks: 0,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Weekend Special",
    subtitle: "Extra discounts this weekend",
    placement: "Homepage Slider",
    status: "scheduled",
    position: 4,
    startDate: "2026-09-25",
    endDate: "2026-09-28",
    clicks: 0,
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
  },
];

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Banners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    placement: "Homepage Hero",
    startDate: "",
    endDate: "",
    image: "",
  });

  const filteredBanners = useMemo(() => {
    const query = search.toLowerCase().trim();

    return banners
      .filter((banner) => {
        const matchesSearch =
          !query ||
          banner.title.toLowerCase().includes(query) ||
          banner.subtitle.toLowerCase().includes(query);

        const matchesStatus =
          status === "all" || banner.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.position - b.position);
  }, [banners, search, status]);

  const summary = useMemo(
    () => ({
      total: banners.length,
      published: banners.filter((item) => item.status === "published")
        .length,
      scheduled: banners.filter((item) => item.status === "scheduled")
        .length,
      drafts: banners.filter((item) => item.status === "draft").length,
      clicks: banners.reduce((sum, item) => sum + item.clicks, 0),
    }),
    [banners]
  );

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      placement: "Homepage Hero",
      startDate: "",
      endDate: "",
      image: "",
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const newBanner = {
      id: Date.now(),
      title: form.title,
      subtitle: form.subtitle,
      placement: form.placement,
      status: "draft",
      position: banners.length + 1,
      startDate: form.startDate,
      endDate: form.endDate,
      clicks: 0,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    };

    setBanners((current) => [...current, newBanner]);
    resetForm();
    setShowForm(false);
  };

  const togglePublish = (id) => {
    setBanners((current) =>
      current.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status:
                banner.status === "published" ? "draft" : "published",
            }
          : banner
      )
    );
  };

  const deleteBanner = (id) => {
    if (!window.confirm("Delete this banner?")) return;

    setBanners((current) => current.filter((banner) => banner.id !== id));
  };

  const moveBanner = (id, direction) => {
    setBanners((current) => {
      const sorted = [...current].sort((a, b) => a.position - b.position);
      const index = sorted.findIndex((item) => item.id === id);

      if (index === -1) return current;

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= sorted.length) {
        return current;
      }

      [sorted[index], sorted[targetIndex]] = [
        sorted[targetIndex],
        sorted[index],
      ];

      return sorted.map((item, itemIndex) => ({
        ...item,
        position: itemIndex + 1,
      }));
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <ImageIcon className="h-4 w-4" />
              Storefront CMS
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Banners & Homepage Sliders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage promotional banners and homepage slider content.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBanners([...initialBanners])}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Banner
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Banners
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
              <ImageIcon className="h-5 w-5 text-indigo-600" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Published
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-emerald-600">
                {summary.published}
              </p>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Scheduled
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-indigo-600">
                {summary.scheduled}
              </p>
              <CalendarDays className="h-5 w-5 text-indigo-600" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Clicks
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">
                {summary.clicks.toLocaleString("en-IN")}
              </p>
              <ExternalLink className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search banners..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 sm:w-44"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Banner list */}
        <div className="space-y-4">
          {filteredBanners.map((banner, index) => (
            <div
              key={banner.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 lg:h-44 lg:w-72 lg:flex-shrink-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3 rounded-lg bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white">
                    Position #{banner.position}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-slate-900">
                          {banner.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {banner.subtitle}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusStyles[banner.status]
                        }`}
                      >
                        {banner.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-400">Placement</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {banner.placement}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Start Date</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(banner.startDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">End Date</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(banner.endDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Clicks</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {banner.clicks.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    {/* Reorder */}
                    <div className="flex items-center gap-1">
                      <GripVertical className="mr-1 h-4 w-4 text-slate-400" />

                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveBanner(banner.id, "up")}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        disabled={index === filteredBanners.length - 1}
                        onClick={() => moveBanner(banner.id, "down")}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBanner(banner)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePublish(banner.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                          banner.status === "published"
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {banner.status === "published" ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Publish
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteBanner(banner.id)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredBanners.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-900">
                No banners found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search or create a new banner.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Banner Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Banner
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add promotional content to the storefront.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Banner Title
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Diwali Mega Sale"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Subtitle
                </label>
                <input
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  placeholder="Short promotional message"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Placement
                  </label>
                  <select
                    value={form.placement}
                    onChange={(e) =>
                      setForm({ ...form, placement: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  >
                    <option>Homepage Hero</option>
                    <option>Homepage Slider</option>
                    <option>Category Banner</option>
                    <option>Promotional Strip</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Image URL
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">
                  Banner Preview
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedBanner.placement}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBanner(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-100 p-5">
              <div className="relative aspect-[16/6] overflow-hidden rounded-xl bg-slate-900">
                <img
                  src={selectedBanner.image}
                  alt={selectedBanner.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-slate-950/35" />

                <div className="absolute inset-0 flex items-center px-8 sm:px-14">
                  <div className="max-w-xl text-white">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider">
                      Featured
                    </p>

                    <h3 className="text-2xl font-bold sm:text-4xl">
                      {selectedBanner.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/90 sm:text-base">
                      {selectedBanner.subtitle}
                    </p>

                    <button
                      type="button"
                      className="mt-5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Monitor className="h-4 w-4" />
                Desktop preview
                <span className="mx-2">•</span>
                <Smartphone className="h-4 w-4" />
                Responsive storefront
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;