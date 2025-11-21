# Landing Page Customizer - Deployment Checklist

## 🚀 Pre-Deployment Steps

### 1. Deploy Smart Contract

```bash
cd backend/move/creator_profile
sui move build
sui client publish --gas-budget 100000000
```

**After deployment, you'll get:**
- Package ID
- LandingPageRegistry object ID

### 2. Update Constants

Edit `frontend/src/lib/constants.ts`:

```typescript
// Update this line with the LandingPageRegistry object ID from deployment
export const LANDING_PAGE_REGISTRY_ID = '0x...';  // ← Add your registry ID here
```

### 3. Verify Walrus Endpoints

Check `frontend/src/lib/constants.ts`:

```typescript
export const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
export const WALRUS_AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';
export const WALRUS_DEFAULT_EPOCHS = 5;
```

---

## ✅ Testing Checklist

### **Builder UI**
- [ ] Navigate to `/dashboard/landing`
- [ ] Connect wallet
- [ ] Layout tab shows sections
- [ ] Can drag & drop sections
- [ ] Can add new sections
- [ ] Can enable/disable sections

### **Details Panel**
- [ ] Can upload profile photo → Walrus
- [ ] Can upload cover photo → Walrus
- [ ] Can select theme colors
- [ ] Can edit about section
- [ ] Can add social links
- [ ] Images preview correctly

### **Save Functionality**
- [ ] Click "Save" button
- [ ] See "Uploading to Walrus..." toast
- [ ] See progress percentage
- [ ] See success message
- [ ] Data persists on refresh

### **Publish Functionality**
- [ ] Click "Publish" button
- [ ] See success message
- [ ] See public URL in toast
- [ ] Can click URL to open page

### **Public Page**
- [ ] Visit `/c/[your-address]`
- [ ] Page loads correctly
- [ ] Images display from Walrus
- [ ] Sections render properly
- [ ] Theme colors applied
- [ ] Mobile responsive

---

## 🔍 Verification Steps

### **1. Check Walrus Upload**

After uploading an image:
```
✅ Blob ID shown in UI
✅ Can click blob ID to view image
✅ Image accessible at: https://aggregator.walrus-testnet.walrus.space/v1/blobs/{blobId}
```

### **2. Check On-Chain Data**

After saving/publishing:
```bash
# Query your landing page config
sui client object <config-object-id>
```

Should see:
```json
{
  "creator_address": "0x...",
  "walrus_blob_id": "...",
  "is_published": true,
  "version": 1
}
```

### **3. Check Walrus JSON**

Visit: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/{walrus_blob_id}`

Should see your landing page JSON:
```json
{
  "id": "...",
  "creatorAddress": "0x...",
  "header": {...},
  "theme": {...},
  "sections": [...]
}
```

---

## 🐛 Troubleshooting

### **Issue: "LANDING_PAGE_REGISTRY_ID is empty"**

**Solution:**
1. Deploy smart contract first
2. Copy LandingPageRegistry object ID
3. Update `src/lib/constants.ts`
4. Restart dev server

### **Issue: "Failed to upload to Walrus"**

**Possible causes:**
- Walrus endpoints down
- File too large
- Network issues

**Solutions:**
- Check Walrus status
- Reduce file size
- Try again

### **Issue: "Transaction failed"**

**Possible causes:**
- Insufficient gas
- Wrong object IDs
- Contract not deployed

**Solutions:**
- Add more SUI to wallet
- Verify constants.ts
- Redeploy contract

### **Issue: "Public page shows 404"**

**Possible causes:**
- Page not published
- Wrong address
- Data not loaded

**Solutions:**
- Click "Publish" in builder
- Check URL format: `/c/0x...`
- Wait for Walrus propagation

### **Issue: "Images not loading"**

**Possible causes:**
- Walrus blob ID incorrect
- Aggregator down
- CORS issues

**Solutions:**
- Verify blob ID in browser
- Check Walrus status
- Clear browser cache

---

## 📊 Performance Checks

### **Upload Speed**
- Profile photo (500KB): ~2-5 seconds
- Cover photo (1MB): ~3-8 seconds
- Landing page JSON (10KB): ~1-2 seconds

### **Page Load Speed**
- Builder UI: < 1 second
- Public page: < 2 seconds
- Image loading: < 3 seconds

### **Gas Costs**
- Create landing page: ~0.01 SUI
- Update landing page: ~0.005 SUI
- Publish: ~0.003 SUI

---

## 🎯 Production Readiness

### **Before Going Live**

- [ ] Smart contract audited
- [ ] Walrus endpoints stable
- [ ] Error handling tested
- [ ] Mobile UI tested
- [ ] SEO metadata added
- [ ] Analytics integrated
- [ ] Backup strategy defined

### **Launch Checklist**

- [ ] Deploy to mainnet
- [ ] Update all constants
- [ ] Test with real users
- [ ] Monitor Walrus usage
- [ ] Track gas costs
- [ ] Set up alerts

---

## 📝 Post-Deployment

### **Monitor**
- Walrus upload success rate
- Transaction success rate
- Page load times
- User feedback

### **Optimize**
- Image compression
- JSON minification
- Caching strategy
- CDN integration

### **Scale**
- Multiple creators
- High traffic handling
- Walrus epoch management
- Gas optimization

---

## 🎓 Quick Commands

### **Deploy Contract**
```bash
cd backend/move/creator_profile
sui move build
sui client publish --gas-budget 100000000
```

### **Start Dev Server**
```bash
cd frontend
npm run dev
```

### **Build for Production**
```bash
cd frontend
npm run build
npm run start
```

### **Check Walrus Blob**
```bash
curl https://aggregator.walrus-testnet.walrus.space/v1/blobs/{blobId}
```

### **Query On-Chain Object**
```bash
sui client object <object-id>
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Smart contract deployed
2. ✅ Registry ID updated in constants
3. ✅ Can create landing page
4. ✅ Images upload to Walrus
5. ✅ Data saves to Walrus
6. ✅ Can publish page
7. ✅ Public page accessible
8. ✅ All features working

---

## 🆘 Need Help?

- **Smart Contract**: Check `creator_landing.move`
- **Storage**: Check `landing-storage.ts`
- **Hooks**: Check `useLandingPage.ts`
- **UI**: Check `PageBuilder.tsx`
- **Docs**: Check `LANDING_PAGE_FULL_IMPLEMENTATION.md`

---

**Ready to deploy?** Follow this checklist step by step! 🚀
