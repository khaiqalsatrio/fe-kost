import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  centerIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
    gap: 25,
  },
  card: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 20,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kostName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D97706',
  },
  facilitiesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceTag: {
    fontSize: 18,
    fontWeight: '900',
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
});
