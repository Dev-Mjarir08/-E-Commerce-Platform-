import Banner from '../models/Banner.js';

export const getBanners = async (req, res) => {
  try {
    const { placement, status } = req.query;
    const query = {};
    if (placement && placement !== 'all') query.placement = placement;
    if (status && status !== 'all') query.status = status;

    const banners = await Banner.find(query).sort({ position: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch banners', error: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, placement, status, position, startDate, endDate, image, link } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required.' });
    }

    const banner = new Banner({
      title: title.trim(),
      subtitle: (subtitle || '').trim(),
      placement: placement || 'Homepage Hero',
      status: status || 'published',
      position: Number(position) || 1,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      image,
      link: link || '/shop'
    });

    await banner.save();
    return res.status(201).json({
      success: true,
      message: 'Banner created successfully.',
      data: banner
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to create banner', error: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Banner updated successfully.',
      data: banner
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to update banner', error: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Banner deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete banner', error: error.message });
  }
};

export const recordBannerClick = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true });
    return res.status(200).json({ success: true, clicks: banner?.clicks || 0 });
  } catch {
    return res.status(200).json({ success: true });
  }
};
