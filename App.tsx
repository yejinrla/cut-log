import { StatusBar } from 'expo-status-bar';
import { useFonts, Gaegu_400Regular, Gaegu_700Bold } from '@expo-google-fonts/gaegu';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const stripItems = new Array(4).fill(null);

const albumCards = [
  { id: '1', title: '데이트', count: '88', tilt: '-2deg' },
  { id: '2', title: '여행', count: '64', tilt: '2deg' },
  { id: '3', title: '가족', count: '41', tilt: '-1.5deg' },
  { id: '4', title: '친구', count: '52', tilt: '2.4deg' },
] as const;

const albumFilters = [
  { key: 'all', label: '전체 37', active: true },
  { key: 'favorites', label: '즐겨찾기 54', active: false },
  { key: 'recent', label: '최근 24', active: false },
] as const;

const searchSuggestions = ['성수', '여행', '우정네컷', '비 오는 날', '가족'] as const;

const albumMoments: Record<
  (typeof albumCards)[number]['id'],
  { caption: string; date: string; place: string }[]
> = {
  '1': [
    { caption: '첫 여름 데이트', date: '2023.06.25', place: '성수' },
    { caption: '비 오는 날 인생네컷', date: '2023.07.02', place: '서울숲' },
    { caption: '퇴근 후 사진관', date: '2023.08.18', place: '연남' },
    { caption: '주말 산책 셀프포토', date: '2023.09.10', place: '망원' },
  ],
  '2': [
    { caption: '부산 바다 앞', date: '2024.02.11', place: '광안리' },
    { caption: '교토 필름네컷', date: '2024.04.03', place: '교토' },
    { caption: '제주 노을컷', date: '2024.05.21', place: '애월' },
    { caption: '도쿄 야간 포토', date: '2024.06.04', place: '시부야' },
  ],
  '3': [
    { caption: '설날 가족사진', date: '2024.01.28', place: '대전' },
    { caption: '엄마 생일 기념', date: '2024.03.16', place: '분당' },
    { caption: '사촌들과 하루', date: '2024.05.05', place: '용인' },
    { caption: '여름 외식 후', date: '2024.07.13', place: '수원' },
  ],
  '4': [
    { caption: '졸업식 네컷', date: '2022.12.18', place: '서울' },
    { caption: '생일파티 셀프포토', date: '2023.10.08', place: '건대' },
    { caption: '새해 첫 기록', date: '2024.01.01', place: '을지로' },
    { caption: '오랜만의 모임', date: '2024.06.22', place: '성수' },
  ],
};

type TabKey = 'home' | 'album' | 'search' | 'profile';

export default function App() {
  const [fontsLoaded] = useFonts({
    Gaegu_400Regular,
    Gaegu_700Bold,
  });
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<(typeof albumCards)[number]['id'] | null>(null);

  if (!fontsLoaded) {
    return <View style={styles.loadingScreen} />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <AppHeader />
        {activeTab === 'home' ? (
          <HomeScreen />
        ) : activeTab === 'album' ? (
          <AlbumScreen onOpenAlbum={setSelectedAlbumId} />
        ) : activeTab === 'search' ? (
          <SearchScreen />
        ) : (
          <ProfileScreen />
        )}
        <BottomNav
          activeTab={activeTab}
          onChange={setActiveTab}
          onPressAdd={() => setIsSheetOpen(true)}
        />
        <AddBottomSheet visible={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
        <AlbumDetailModal albumId={selectedAlbumId} onClose={() => setSelectedAlbumId(null)} />
      </View>
    </SafeAreaView>
  );
}

function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>cutlog.</Text>
      <View style={styles.headerActions}>
        <View style={styles.refreshIcon}>
          <View style={styles.refreshArc} />
          <View style={styles.refreshHeadA} />
          <View style={styles.refreshHeadB} />
        </View>
        <View style={styles.headerDot} />
      </View>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.caption}>3년 전 오늘 ✳</Text>

      <View style={styles.stripTilt}>
        <View style={styles.stripOuter}>
          {stripItems.map((_, index) => (
            <View
              key={index}
              style={[styles.stripSlot, index < stripItems.length - 1 && styles.stripGap]}
            >
              <View style={styles.stripPattern}>
                {Array.from({ length: 14 }).map((__, stripeIndex) => (
                  <View
                    key={stripeIndex}
                    style={[styles.stripStripe, { left: stripeIndex * 18 - 26 }]}
                  />
                ))}
              </View>
            </View>
          ))}
          <Text style={styles.stripFooter}>인생네컷 · 성수</Text>
        </View>
      </View>
    </View>
  );
}

function AlbumScreen({
  onOpenAlbum,
}: {
  onOpenAlbum: (albumId: (typeof albumCards)[number]['id']) => void;
}) {
  return (
    <ScrollView
      style={styles.albumScroll}
      contentContainerStyle={styles.albumContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.albumHeaderWrap}>
        <Text style={styles.albumTitle}>앨범</Text>
        <View style={styles.albumUnderline} />
      </View>

      <View style={styles.filterRow}>
        {albumFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            activeOpacity={0.85}
            style={[styles.filterChip, filter.active && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter.active && styles.filterTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.albumGrid}>
        {albumCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.albumCardWrap}
            activeOpacity={0.9}
            onPress={() => onOpenAlbum(card.id)}
          >
            <View style={[styles.albumCard, { transform: [{ rotate: card.tilt }] }]}>
              <View style={styles.albumSpine} />
              <View style={styles.albumSpineLines}>
                {Array.from({ length: 19 }).map((_, index) => (
                  <View key={index} style={styles.albumSpineLine} />
                ))}
              </View>
              <View style={styles.albumPhotoWindow}>
                <View style={styles.albumPhotoPattern}>
                  {Array.from({ length: 15 }).map((_, index) => (
                    <View
                      key={index}
                      style={[styles.albumPhotoStripe, { left: index * 16 - 20 }]}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.albumMetaRow}>
              <Text style={styles.albumMetaTitle}>{card.title}</Text>
              <Text style={styles.albumMetaCount}>{card.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function AlbumDetailModal({
  albumId,
  onClose,
}: {
  albumId: (typeof albumCards)[number]['id'] | null;
  onClose: () => void;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const flipAnim = useRef(new Animated.Value(0)).current;

  if (!albumId) {
    return null;
  }

  const album = albumCards.find((card) => card.id === albumId)!;
  const pages = albumMoments[albumId];
  const currentPage = pages[pageIndex];

  const handleNextPage = () => {
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPageIndex((prev) => (prev + 1) % pages.length);
    });
  };

  const pageRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-12deg'],
  });

  const pageShift = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.detailOverlay}>
        <Pressable style={styles.detailBackdrop} onPress={onClose} />
        <View style={styles.detailShell}>
          <View style={styles.detailTopRow}>
            <View>
              <Text style={styles.detailTitle}>{album.title}</Text>
              <Text style={styles.detailSubtitle}>{album.count}개의 순간</Text>
            </View>
            <TouchableOpacity style={styles.detailClose} activeOpacity={0.85} onPress={onClose}>
              <Text style={styles.detailCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.openAlbumWrap}>
            <View style={styles.openAlbumSpine} />
            <View style={styles.openAlbumBase}>
              <View style={styles.leftPage}>
                <Text style={styles.pageCaption}>album note</Text>
                <Text style={styles.leftPageTitle}>{album.title}</Text>
                <Text style={styles.leftPageMeta}>차곡차곡 모아둔 우리의 장면들</Text>
              </View>

              <TouchableOpacity activeOpacity={0.95} style={styles.rightPageTapArea} onPress={handleNextPage}>
                <Animated.View
                  style={[
                    styles.rightPage,
                    {
                      transform: [{ perspective: 900 }, { rotateY: pageRotate }, { translateX: pageShift }],
                    },
                  ]}
                >
                  <View style={styles.detailPhotoFrame}>
                    <View style={styles.detailPhotoPattern}>
                      {Array.from({ length: 18 }).map((_, index) => (
                        <View
                          key={index}
                          style={[styles.detailPhotoStripe, { left: index * 18 - 26 }]}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.detailMomentTitle}>{currentPage.caption}</Text>
                  <Text style={styles.detailMomentMeta}>
                    {currentPage.date} · {currentPage.place}
                  </Text>
                  <Text style={styles.detailHint}>오른쪽 페이지를 눌러 넘기기</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SearchScreen() {
  return (
    <View style={styles.searchScreen}>
      <View style={styles.searchHeaderWrap}>
        <Text style={styles.searchTitle}>검색</Text>
        <Text style={styles.searchHint}>장소, 사람, 날짜로 순간을 찾아보세요</Text>
      </View>

      <View style={styles.searchBar}>
        <Image
          source={require('./assets/search-icon.png')}
          style={styles.searchBarIcon}
          resizeMode="contain"
        />
        <Text style={styles.searchPlaceholder}>성수, 친구, 2024.06.25</Text>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.searchSectionTitle}>추천 키워드</Text>
        <View style={styles.searchChipRow}>
          {searchSuggestions.map((keyword) => (
            <TouchableOpacity key={keyword} style={styles.searchChip} activeOpacity={0.85}>
              <Text style={styles.searchChipText}>{keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.searchSectionTitle}>최근 검색</Text>
        <View style={styles.searchList}>
          <View style={styles.searchListItem}>
            <Text style={styles.searchListTitle}>성수 인생네컷</Text>
            <Text style={styles.searchListMeta}>2023.06.25 · 예진 · 지훈</Text>
          </View>
          <View style={styles.searchListDivider} />
          <View style={styles.searchListItem}>
            <Text style={styles.searchListTitle}>부산 여행 셀프포토</Text>
            <Text style={styles.searchListMeta}>2024.02.11 · 가족</Text>
          </View>
          <View style={styles.searchListDivider} />
          <View style={styles.searchListItem}>
            <Text style={styles.searchListTitle}>졸업식 네컷</Text>
            <Text style={styles.searchListMeta}>2022.12.18 · 친구</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ProfileScreen() {
  return (
    <ScrollView
      style={styles.profileScroll}
      contentContainerStyle={styles.profileContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHero}>
        <View style={styles.profileAvatar}>
          <Image
            source={require('./assets/person-icon.png')}
            style={styles.profileAvatarIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.profileName}>예진</Text>
        <Text style={styles.profileHandle}>@cutlog.daily</Text>
      </View>

      <View style={styles.profileStats}>
        <View style={styles.profileStatCard}>
          <Text style={styles.profileStatNumber}>37</Text>
          <Text style={styles.profileStatLabel}>앨범</Text>
        </View>
        <View style={styles.profileStatCard}>
          <Text style={styles.profileStatNumber}>128</Text>
          <Text style={styles.profileStatLabel}>기록</Text>
        </View>
        <View style={styles.profileStatCard}>
          <Text style={styles.profileStatNumber}>9</Text>
          <Text style={styles.profileStatLabel}>즐겨찾기</Text>
        </View>
      </View>

      <View style={styles.profileMenu}>
        <TouchableOpacity style={styles.profileMenuCard} activeOpacity={0.85}>
          <Text style={styles.profileMenuTitle}>내 정보</Text>
          <Text style={styles.profileMenuSubtitle}>이름, 프로필, 계정 관리</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileMenuCard} activeOpacity={0.85}>
          <Text style={styles.profileMenuTitle}>보관함</Text>
          <Text style={styles.profileMenuSubtitle}>숨김 기록과 임시 저장 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileMenuCard} activeOpacity={0.85}>
          <Text style={styles.profileMenuTitle}>설정</Text>
          <Text style={styles.profileMenuSubtitle}>알림, 백업, 앱 환경 설정</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function BottomNav({
  activeTab,
  onChange,
  onPressAdd,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  onPressAdd: () => void;
}) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} activeOpacity={0.85} onPress={() => onChange('home')}>
        <Image source={require('./assets/home-icon.png')} style={styles.assetIcon} resizeMode="contain" />
        <Text style={activeTab === 'home' ? styles.navLabelActive : styles.navLabel}>홈</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.85} onPress={() => onChange('album')}>
        <Image source={require('./assets/layers-icon.png')} style={styles.assetIcon} resizeMode="contain" />
        <Text style={activeTab === 'album' ? styles.navLabelActive : styles.navLabel}>앨범</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.centerButtonWrap} activeOpacity={0.85} onPress={onPressAdd}>
        <View style={styles.centerButton}>
          <View style={styles.plusVertical} />
          <View style={styles.plusHorizontal} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.85} onPress={() => onChange('search')}>
        <Image source={require('./assets/search-icon.png')} style={styles.assetIcon} resizeMode="contain" />
        <Text style={activeTab === 'search' ? styles.navLabelActive : styles.navLabel}>검색</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.85} onPress={() => onChange('profile')}>
        <Image source={require('./assets/person-icon.png')} style={styles.assetIcon} resizeMode="contain" />
        <Text style={activeTab === 'profile' ? styles.navLabelActive : styles.navLabel}>나</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddBottomSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const actions = [
    { key: 'camera', title: '카메라', subtitle: '바로 촬영해서 추가' },
    { key: 'gallery', title: '사진첩', subtitle: '기존 사진 가져오기' },
    { key: 'album', title: '새 앨범', subtitle: '테마별 앨범 만들기' },
  ] as const;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <View style={styles.sheetPanel}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>무엇을 추가할까요?</Text>
          <View style={styles.sheetList}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.key}
                activeOpacity={0.85}
                style={styles.sheetAction}
                onPress={onClose}
              >
                <View style={styles.sheetBullet} />
                <View style={styles.sheetCopy}>
                  <Text style={styles.sheetActionTitle}>{action.title}</Text>
                  <Text style={styles.sheetActionSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const handwritten = {
  fontFamily: 'Gaegu_400Regular' as const,
};

const handwrittenBold = {
  fontFamily: 'Gaegu_700Bold' as const,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FCFCFB',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FCFCFB',
  },
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FCFCFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  logo: {
    ...handwrittenBold,
    color: '#1A1A1A',
    fontSize: 24,
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  refreshIcon: {
    width: 22,
    height: 22,
    position: 'relative',
  },
  refreshArc: {
    position: 'absolute',
    top: 4,
    left: 5,
    width: 11,
    height: 11,
    borderTopWidth: 2.2,
    borderRightWidth: 2.2,
    borderColor: '#1A1A1A',
    borderTopRightRadius: 10,
    transform: [{ rotate: '138deg' }],
  },
  refreshHeadA: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 7,
    height: 2.2,
    backgroundColor: '#1A1A1A',
    borderRadius: 99,
    transform: [{ rotate: '34deg' }],
  },
  refreshHeadB: {
    position: 'absolute',
    top: 8,
    right: 2,
    width: 7,
    height: 2.2,
    backgroundColor: '#1A1A1A',
    borderRadius: 99,
    transform: [{ rotate: '-42deg' }],
  },
  headerDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 120,
  },
  caption: {
    ...handwritten,
    fontSize: 20,
    color: '#8B8A85',
    marginBottom: 18,
    letterSpacing: 0.6,
  },
  stripTilt: {
    transform: [{ rotate: '-1.4deg' }],
    marginBottom: 8,
  },
  stripOuter: {
    width: 164,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FCFCFB',
    borderWidth: 2.8,
    borderColor: '#242424',
    borderRadius: 17,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  stripSlot: {
    height: 108,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D4D4CF',
    backgroundColor: '#ECEBE6',
    overflow: 'hidden',
  },
  stripPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.55,
    backgroundColor: '#ECEBE6',
    overflow: 'hidden',
  },
  stripStripe: {
    position: 'absolute',
    top: -24,
    width: 7,
    height: 180,
    backgroundColor: '#F4F3EF',
    transform: [{ rotate: '-35deg' }],
  },
  stripGap: {
    marginBottom: 5,
  },
  stripFooter: {
    ...handwritten,
    marginTop: 5,
    textAlign: 'center',
    color: '#222222',
    fontSize: 12,
  },
  albumScroll: {
    flex: 1,
  },
  albumContent: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 124,
  },
  albumHeaderWrap: {
    alignSelf: 'flex-start',
    marginBottom: 22,
  },
  albumTitle: {
    ...handwrittenBold,
    fontSize: 30,
    color: '#111111',
    lineHeight: 32,
  },
  albumUnderline: {
    marginTop: 7,
    width: 78,
    height: 7,
    borderTopWidth: 3,
    borderColor: '#1A1A1A',
    borderRadius: 99,
    transform: [{ rotate: '-1deg' }],
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 18,
    backgroundColor: '#FCFCFB',
  },
  filterChipActive: {
    backgroundColor: '#1A1A1A',
  },
  filterText: {
    ...handwritten,
    color: '#1A1A1A',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FCFCFB',
  },
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 30,
    rowGap: 34,
  },
  albumCardWrap: {
    width: '42%',
  },
  albumCard: {
    height: 242,
    borderWidth: 2.8,
    borderColor: '#262626',
    borderRadius: 16,
    backgroundColor: '#FCFCFB',
    paddingTop: 12,
    paddingRight: 11,
    paddingBottom: 12,
    paddingLeft: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  albumSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 16,
    borderTopLeftRadius: 13,
    borderBottomLeftRadius: 13,
    backgroundColor: '#1F1F1F',
  },
  albumSpineLines: {
    position: 'absolute',
    left: 10,
    top: 6,
    bottom: 6,
    width: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  albumSpineLine: {
    width: 4,
    height: 2,
    backgroundColor: '#FCFCFB',
    borderRadius: 99,
  },
  albumPhotoWindow: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    borderRadius: 4,
    backgroundColor: '#ECEBE6',
    overflow: 'hidden',
  },
  albumPhotoPattern: {
    flex: 1,
    backgroundColor: '#ECEBE6',
    overflow: 'hidden',
  },
  albumPhotoStripe: {
    position: 'absolute',
    top: -20,
    width: 7,
    height: 320,
    backgroundColor: '#F4F3EF',
    transform: [{ rotate: '-35deg' }],
    opacity: 0.9,
  },
  albumMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
    paddingHorizontal: 4,
  },
  albumMetaTitle: {
    ...handwrittenBold,
    fontSize: 18,
    color: '#111111',
  },
  albumMetaCount: {
    ...handwritten,
    fontSize: 18,
    color: '#8C8B84',
  },
  detailOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 18, 15, 0.28)',
    paddingHorizontal: 18,
  },
  detailBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  detailShell: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 28,
    backgroundColor: '#FCFCFB',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  detailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTitle: {
    ...handwrittenBold,
    fontSize: 30,
    color: '#111111',
  },
  detailSubtitle: {
    ...handwritten,
    fontSize: 16,
    color: '#8C8B84',
    marginTop: 2,
  },
  detailClose: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 16,
  },
  detailCloseText: {
    ...handwritten,
    fontSize: 15,
    color: '#111111',
  },
  openAlbumWrap: {
    alignItems: 'center',
  },
  openAlbumBase: {
    width: '100%',
    height: 420,
    flexDirection: 'row',
    backgroundColor: '#F6F1E8',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  openAlbumSpine: {
    position: 'absolute',
    left: 18,
    top: 82,
    bottom: 22,
    width: 18,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#2A2929',
    zIndex: 2,
  },
  leftPage: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 20,
    paddingTop: 26,
    paddingBottom: 24,
    borderRightWidth: 1.5,
    borderRightColor: '#DDD6C7',
    backgroundColor: '#FBF8F2',
  },
  pageCaption: {
    ...handwritten,
    fontSize: 14,
    color: '#8C8B84',
    marginBottom: 26,
  },
  leftPageTitle: {
    ...handwrittenBold,
    fontSize: 34,
    color: '#111111',
    marginBottom: 8,
  },
  leftPageMeta: {
    ...handwritten,
    fontSize: 18,
    color: '#6F6C63',
    lineHeight: 24,
  },
  rightPageTapArea: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  rightPage: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFDF8',
    borderLeftWidth: 1,
    borderLeftColor: '#EFE6D5',
  },
  detailPhotoFrame: {
    height: 258,
    borderWidth: 2,
    borderColor: '#474747',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#ECEBE6',
    marginBottom: 16,
  },
  detailPhotoPattern: {
    flex: 1,
    backgroundColor: '#ECEBE6',
    overflow: 'hidden',
  },
  detailPhotoStripe: {
    position: 'absolute',
    top: -18,
    width: 8,
    height: 320,
    backgroundColor: '#F4F3EF',
    transform: [{ rotate: '-35deg' }],
    opacity: 0.92,
  },
  detailMomentTitle: {
    ...handwrittenBold,
    fontSize: 24,
    color: '#111111',
  },
  detailMomentMeta: {
    ...handwritten,
    fontSize: 16,
    color: '#8C8B84',
    marginTop: 4,
  },
  detailHint: {
    ...handwritten,
    fontSize: 14,
    color: '#B2AA98',
    marginTop: 18,
    textAlign: 'right',
  },
  searchScreen: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 118,
  },
  searchHeaderWrap: {
    marginBottom: 18,
  },
  searchTitle: {
    ...handwrittenBold,
    fontSize: 30,
    color: '#111111',
    lineHeight: 32,
  },
  searchHint: {
    ...handwritten,
    marginTop: 4,
    fontSize: 16,
    color: '#8C8B84',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FCFCFB',
    marginBottom: 22,
  },
  searchBarIcon: {
    width: 18,
    height: 18,
  },
  searchPlaceholder: {
    ...handwritten,
    fontSize: 17,
    color: '#8C8B84',
  },
  searchSection: {
    marginBottom: 24,
  },
  searchSectionTitle: {
    ...handwrittenBold,
    fontSize: 20,
    color: '#111111',
    marginBottom: 12,
  },
  searchChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  searchChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    backgroundColor: '#FCFCFB',
  },
  searchChipText: {
    ...handwritten,
    fontSize: 15,
    color: '#111111',
  },
  searchList: {
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 20,
    backgroundColor: '#FCFCFB',
    overflow: 'hidden',
  },
  searchListItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchListTitle: {
    ...handwrittenBold,
    fontSize: 18,
    color: '#111111',
  },
  searchListMeta: {
    ...handwritten,
    fontSize: 15,
    color: '#8C8B84',
    marginTop: 2,
  },
  searchListDivider: {
    height: 2,
    backgroundColor: '#E7E2D9',
  },
  profileScroll: {
    flex: 1,
  },
  profileContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 124,
  },
  profileHero: {
    alignItems: 'center',
    marginBottom: 22,
  },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.4,
    borderColor: '#1A1A1A',
    backgroundColor: '#F6F3ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileAvatarIcon: {
    width: 38,
    height: 38,
  },
  profileName: {
    ...handwrittenBold,
    fontSize: 28,
    color: '#111111',
  },
  profileHandle: {
    ...handwritten,
    fontSize: 17,
    color: '#8C8B84',
    marginTop: 2,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 22,
  },
  profileStatCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 14,
    backgroundColor: '#FCFCFB',
  },
  profileStatNumber: {
    ...handwrittenBold,
    fontSize: 24,
    color: '#111111',
  },
  profileStatLabel: {
    ...handwritten,
    fontSize: 15,
    color: '#8C8B84',
    marginTop: 2,
  },
  profileMenu: {
    gap: 12,
  },
  profileMenuCard: {
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FCFCFB',
  },
  profileMenuTitle: {
    ...handwrittenBold,
    fontSize: 20,
    color: '#111111',
  },
  profileMenuSubtitle: {
    ...handwritten,
    fontSize: 15,
    color: '#8C8B84',
    marginTop: 3,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 14,
    paddingBottom: 20,
    paddingHorizontal: 14,
    borderTopWidth: 2,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#FCFCFB',
  },
  navItem: {
    width: 58,
    alignItems: 'center',
    gap: 6,
  },
  navLabelActive: {
    ...handwrittenBold,
    color: '#101010',
    fontSize: 13,
  },
  navLabel: {
    ...handwritten,
    color: '#9A9994',
    fontSize: 13,
  },
  centerButtonWrap: {
    width: 64,
    alignItems: 'center',
  },
  centerButton: {
    width: 50,
    height: 38,
    borderWidth: 2.4,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    backgroundColor: '#FCFCFB',
    transform: [{ rotate: '-2deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusVertical: {
    position: 'absolute',
    width: 2.4,
    height: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 99,
  },
  plusHorizontal: {
    width: 16,
    height: 2.4,
    backgroundColor: '#1A1A1A',
    borderRadius: 99,
  },
  assetIcon: {
    width: 22,
    height: 22,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20, 18, 15, 0.22)',
  },
  sheetBackdrop: {
    flex: 1,
  },
  sheetPanel: {
    backgroundColor: '#FCFCFB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#1A1A1A',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 58,
    height: 6,
    borderRadius: 99,
    backgroundColor: '#D7D3CB',
    marginBottom: 14,
  },
  sheetTitle: {
    ...handwrittenBold,
    fontSize: 24,
    color: '#111111',
    marginBottom: 14,
  },
  sheetList: {
    gap: 12,
  },
  sheetAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FCFCFB',
  },
  sheetBullet: {
    width: 14,
    height: 14,
    borderRadius: 99,
    backgroundColor: '#1A1A1A',
  },
  sheetCopy: {
    flex: 1,
  },
  sheetActionTitle: {
    ...handwrittenBold,
    fontSize: 20,
    color: '#111111',
    lineHeight: 22,
  },
  sheetActionSubtitle: {
    ...handwritten,
    fontSize: 15,
    color: '#8C8B84',
    marginTop: 2,
  },
});
