package sliceutil

// IsInStringSlice 判断一个字符串是否在给定的字符串列表里面
func IsInStringSlice(slice []string, s string) bool {
	if len(slice) == 0 {
		return false
	}

	for _, v := range slice {
		if s == v {
			return true
		}
	}

	return false
}

// IsInUintSlice 判断一个数字是否在给定的slice里面
func IsInUintSlice(slice []uint, u uint) bool {
	if len(slice) == 0 {
		return false
	}

	for _, v := range slice {
		if u == v {
			return true
		}
	}

	return false
}
